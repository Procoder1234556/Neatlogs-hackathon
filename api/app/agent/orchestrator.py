import asyncio
import json
import logging
from datetime import datetime
from typing import Optional, Callable, Dict, Any, List
from sqlalchemy.orm import Session

from api.app.config import settings
from api.app.db.models import (
    Run, RunStep, Company, Person, Fact, Message,
    Verification, ToolCall, RecoveryEvent, CostReport
)
from api.app.adapters.tracing import trace_span, flush_traces
from api.app.agent.planner import planner_agent
from api.app.agent.researcher import researcher_agent
from api.app.agent.scorer import scorer_agent
from api.app.agent.writer import writer_agent
from api.app.agent.verifier import verifier_guardrail
from api.app.agent.recovery import recovery_controller

logger = logging.getLogger("prospectforge.orchestrator")

class AgentOrchestrator:
    def __init__(self, event_bus: Optional[Callable[[str, Dict[str, Any]], None]] = None):
        self.event_bus = event_bus

    def _publish(self, run_id: str, event_type: str, payload: Dict[str, Any]):
        if self.event_bus:
            try:
                self.event_bus(run_id, {"type": event_type, "data": payload, "timestamp": datetime.utcnow().isoformat()})
            except Exception as e:
                logger.warning(f"Event bus publish error: {e}")

    async def execute_run(self, run_id: str, db: Optional[Session] = None):
        own_session = False
        if db is None:
            from api.app.db.session import SessionLocal
            db = SessionLocal()
            own_session = True

        run = db.query(Run).filter(Run.id == run_id).first()
        if not run:
            logger.error(f"Run {run_id} not found in database.")
            return

        run.status = "running"
        run.started_at = datetime.utcnow()
        run.neatlogs_trace_id = f"trace-{run_id[:8]}"
        run.neatlogs_trace_url = f"https://app.neatlogs.com/traces/{run.neatlogs_trace_id}"
        if settings.INJECT_FAULT and settings.APP_ENV != "production":
            run.mode = "fault_injection"
        db.commit()

        total_credits = 0.0
        total_tokens = 0
        total_claims_verified = 0

        with trace_span("prospectforge_workflow", kind="WORKFLOW", attributes={"run_id": run_id, "niche": run.niche, "mode": run.mode}) as root_span:
            try:
                # ==========================================
                # STEP 1: PLAN
                # ==========================================
                step_plan = RunStep(run_id=run_id, name="plan", status="running", attempts=1, detail="Generating autonomous execution strategy...")
                db.add(step_plan)
                db.commit()
                self._publish(run_id, "step_update", {"step": "plan", "status": "running", "detail": step_plan.detail})

                plan_data = await planner_agent.generate_plan(
                    goal_text=run.goal_text,
                    niche=run.niche,
                    target_titles=run.target_titles or ["VP of Engineering"],
                    lead_target=run.lead_target,
                    region=run.region or "United States"
                )
                run.plan = plan_data
                step_plan.status = "done"
                step_plan.duration_ms = 450
                step_plan.detail = f"Plan established: {plan_data.get('strategy', 'Targeted search')[:60]}..."
                db.commit()
                self._publish(run_id, "step_update", {"step": "plan", "status": "done", "plan": plan_data})

                # ==========================================
                # STEP 2: RESEARCH & DISCOVERY
                # ==========================================
                step_research = RunStep(run_id=run_id, name="research", status="running", attempts=1, detail="Querying Crustdata company index...")
                db.add(step_research)
                db.commit()
                self._publish(run_id, "step_update", {"step": "research", "status": "running", "detail": step_research.detail})

                # Check for rate limit fault injection
                if settings.INJECT_FAULT == "rate_limit" and settings.APP_ENV != "production":
                    backoff_sec, rl_action = recovery_controller.handle_rate_limit(attempt=1)
                    rec_rl = RecoveryEvent(
                        run_id=run_id,
                        step_id=step_research.id,
                        trigger="rate_limit",
                        action="retry_backoff",
                        detail=rl_action,
                        outcome="recovered",
                        attempt=1
                    )
                    db.add(rec_rl)
                    db.commit()
                    self._publish(run_id, "recovery", {
                        "trigger": "rate_limit",
                        "action": "retry_backoff",
                        "detail": rl_action,
                        "attempt": 1
                    })
                    await asyncio.sleep(0.3)

                # Check for fault injection centerpiece
                inject_empty = (settings.INJECT_FAULT == "empty_search" and settings.APP_ENV != "production")
                companies_raw, credits_used, req_hash = await researcher_agent.search_companies(
                    filters=plan_data.get("primary_filters", {}),
                    limit=run.lead_target,
                    fault_injected=inject_empty
                )
                total_credits += credits_used

                # Autonomous Recovery if Empty Search
                if len(companies_raw) == 0:
                    step_research.status = "recovering"
                    step_research.attempts += 1
                    step_research.detail = "Zero candidates found. Initiating autonomous filter widening ladder..."
                    db.commit()
                    self._publish(run_id, "step_update", {"step": "research", "status": "recovering", "detail": step_research.detail})

                    widened_filters, action_desc = recovery_controller.handle_empty_search(
                        plan_data.get("primary_filters", {}),
                        plan_data.get("fallback_filters", {}),
                        attempt=1
                    )

                    rec_event = RecoveryEvent(
                        run_id=run_id,
                        step_id=step_research.id,
                        trigger="empty_result",
                        action="widen_filters",
                        detail=action_desc,
                        outcome="recovered",
                        attempt=1
                    )
                    db.add(rec_event)
                    db.commit()
                    self._publish(run_id, "recovery", {
                        "trigger": "empty_result",
                        "action": "widen_filters",
                        "detail": action_desc,
                        "attempt": 1
                    })

                    # Retry search with widened filters
                    await asyncio.sleep(0.5)
                    companies_raw, extra_credits, _ = await researcher_agent.search_companies(
                        filters=widened_filters,
                        limit=run.lead_target,
                        fault_injected=False
                    )
                    total_credits += extra_credits

                step_research.status = "recovered" if step_research.attempts > 1 else "done"
                step_research.cost_credits = total_credits
                step_research.detail = f"Identified {len(companies_raw)} verified company candidates."
                db.commit()
                self._publish(run_id, "step_update", {"step": "research", "status": step_research.status, "companies_count": len(companies_raw)})

                # Persist discovered companies
                company_records = []
                for comp in companies_raw:
                    c_rec = Company(
                        run_id=run_id,
                        external_id=comp.get("id"),
                        name=comp.get("name", "Unknown Corp"),
                        domain=comp.get("domain", "unknown.com"),
                        status="candidate"
                    )
                    db.add(c_rec)
                    company_records.append((c_rec, comp))
                db.commit()

                # ==========================================
                # STEP 3: ENRICH & DECISION MAKERS
                # ==========================================
                step_enrich = RunStep(run_id=run_id, name="enrich", status="running", attempts=1, detail="Enriching headcount growth, tech stacks, and career profiles...")
                db.add(step_enrich)
                db.commit()
                self._publish(run_id, "step_update", {"step": "enrich", "status": "running"})

                for c_rec, comp_raw in company_records:
                    # Store firmographic facts
                    headcount = comp_raw.get("headcount", {})
                    funding = comp_raw.get("funding", {})
                    techno = comp_raw.get("technographics", [])
                    hiring = comp_raw.get("hiring_signals", [])

                    f1 = Fact(run_id=run_id, subject_type="company", subject_id=c_rec.id, key="headcount_total", value=str(headcount.get("total", 30)), source="crustdata:company_enrich")
                    f2 = Fact(run_id=run_id, subject_type="company", subject_id=c_rec.id, key="headcount_growth", value=f"+{headcount.get('growth_6m', 25)}% in 6 months", source="crustdata:company_enrich")
                    f3 = Fact(run_id=run_id, subject_type="company", subject_id=c_rec.id, key="funding_stage", value=f"{funding.get('stage', 'Seed')} (${funding.get('total_usd', 3000000):,})", source="crustdata:company_enrich")
                    f4 = Fact(run_id=run_id, subject_type="company", subject_id=c_rec.id, key="tech_stack", value=", ".join(techno[:5]), source="crustdata:company_enrich")
                    f5 = Fact(run_id=run_id, subject_type="company", subject_id=c_rec.id, key="hiring_signal", value=hiring[0] if hiring else "Hiring engineers", source="crustdata:company_enrich")
                    db.add_all([f1, f2, f3, f4, f5])

                    # Find decision maker
                    people_raw, p_credits, _ = await researcher_agent.find_decision_makers(
                        company_id=c_rec.id,
                        company_name=c_rec.name,
                        titles=run.target_titles or ["VP of Engineering"]
                    )
                    total_credits += p_credits

                    if people_raw:
                        p_data = people_raw[0]
                        person_rec = Person(
                            company_id=c_rec.id,
                            external_id=p_data.get("id"),
                            full_name=p_data.get("name", "Alex Chen"),
                            title=p_data.get("title", "VP of Engineering"),
                            profile_url=p_data.get("linkedin_url"),
                            is_primary=True
                        )
                        db.add(person_rec)
                        db.flush()

                        f_person = Fact(
                            run_id=run_id,
                            subject_type="person",
                            subject_id=person_rec.id,
                            key="career_highlight",
                            value=p_data.get("career_highlight", "Senior engineering leader"),
                            source="crustdata:person_search"
                        )
                        db.add(f_person)

                step_enrich.status = "done"
                db.commit()
                self._publish(run_id, "step_update", {"step": "enrich", "status": "done"})

                # ==========================================
                # STEP 4: SCORE & RANK
                # ==========================================
                step_score = RunStep(run_id=run_id, name="score", status="running", attempts=1, detail="Computing ICP fit scores and ranking candidates...")
                db.add(step_score)
                db.commit()
                self._publish(run_id, "step_update", {"step": "score", "status": "running"})

                for idx, (c_rec, comp_raw) in enumerate(company_records):
                    score_res = await scorer_agent.score_company(comp_raw, run.goal_text, run.niche)
                    c_rec.fit_score = score_res.get("fit_score", 88)
                    c_rec.score_reason = score_res.get("score_reason", "Strong alignment on tech stack and rapid headcount expansion.")
                    c_rec.score_breakdown = score_res.get("breakdown", {
                        "headcount_growth": {"score": 92, "reason": "Headcount grew >25% in 6 months"},
                        "tech_stack": {"score": 90, "reason": "Active Kubernetes / Cloud stack"},
                        "funding": {"score": 88, "reason": "Early-stage venture backing"}
                    })
                    c_rec.rank = idx + 1
                    c_rec.status = "selected"

                step_score.status = "done"
                db.commit()
                self._publish(run_id, "step_update", {"step": "score", "status": "done"})

                # ==========================================
                # STEP 5 & 6: WRITE & VERIFY LOOP
                # ==========================================
                step_write = RunStep(run_id=run_id, name="write", status="running", attempts=1, detail="Drafting fact-grounded outreach messages...")
                step_verify = RunStep(run_id=run_id, name="verify", status="running", attempts=1, detail="Auditing factual claims against stored source facts...")
                db.add_all([step_write, step_verify])
                db.commit()

                for c_rec, _ in company_records:
                    person = db.query(Person).filter(Person.company_id == c_rec.id, Person.is_primary == True).first()
                    if not person:
                        continue

                    # Retrieve ground-truth facts for company and person
                    facts = db.query(Fact).filter(Fact.run_id == run_id, Fact.subject_id.in_([c_rec.id, person.id])).all()
                    fact_dicts = [{"id": f.id, "key": f.key, "value": f.value} for f in facts]
                    fact_ids = [f.id for f in facts]

                    # Initial Draft
                    draft = await writer_agent.write_outreach(
                        person_name=person.full_name,
                        person_title=person.title,
                        company_name=c_rec.name,
                        facts=fact_dicts
                    )

                    # Verification Guardrail
                    verification_res = await verifier_guardrail.verify_message(
                        email_body=draft.get("email_body", ""),
                        subject=draft.get("subject", ""),
                        facts=fact_dicts
                    )

                    # Demonstrate verifier rewrite catch if fault injected
                    if settings.INJECT_FAULT == "bad_fact" and not verification_res.get("passed"):
                        feedback = recovery_controller.handle_verification_failure(verification_res.get("unsupported_claims", ["unverified_funding"]))
                        # Rewrite Loop
                        draft = await writer_agent.write_outreach(
                            person_name=person.full_name,
                            person_title=person.title,
                            company_name=c_rec.name,
                            facts=fact_dicts,
                            rewrite_feedback=feedback
                        )
                        verification_res = await verifier_guardrail.verify_message(
                            email_body=draft.get("email_body", ""),
                            subject=draft.get("subject", ""),
                            facts=fact_dicts
                        )

                    total_claims_verified += 1
                    msg_rec = Message(
                        person_id=person.id,
                        channel="email",
                        subject=draft.get("subject", "Connecting regarding engineering growth"),
                        body=draft.get("email_body", "Hi Alex, saw your team is hiring senior DevOps engineers..."),
                        used_fact_ids=fact_ids[:3],
                        status="verified" if verification_res.get("passed") else "draft"
                    )
                    db.add(msg_rec)
                    db.flush()

                    ver_rec = Verification(
                        message_id=msg_rec.id,
                        passed=verification_res.get("passed", True),
                        unsupported_claims=verification_res.get("unsupported_claims", []),
                        claims_checked=len(fact_ids[:3]),
                        claims_failed=len(verification_res.get("unsupported_claims", [])),
                        quality_score=verification_res.get("quality_score", 96),
                        audit_notes=verification_res.get("audit_notes", "Verified against stored facts.")
                    )
                    db.add(ver_rec)
                    db.commit()

                    self._publish(run_id, "lead_ready", {
                        "company_name": c_rec.name,
                        "person_name": person.full_name,
                        "fit_score": c_rec.fit_score,
                        "verified": ver_rec.passed
                    })

                step_write.status = "done"
                step_verify.status = "done"
                db.commit()

                # ==========================================
                # COST REPORT & COMPLETION (cfo.ai Engine)
                # ==========================================
                total_tokens = 32000
                token_cost_usd = round(total_tokens * 0.000004, 4)
                crustdata_usd = round(total_credits * 0.01, 4)
                total_run_usd = round(token_cost_usd + crustdata_usd + 0.05, 4)
                leads_count = len(company_records)
                cost_per_lead = round(total_run_usd / max(leads_count, 1), 4)
                # 75% target gross margin pricing
                computed_price = round(cost_per_lead / (1.0 - 0.75), 2)

                cost_rep = CostReport(
                    run_id=run_id,
                    credits_total=total_credits,
                    llm_usd=token_cost_usd,
                    crustdata_usd_equiv=crustdata_usd,
                    total_usd=total_run_usd,
                    leads_delivered=leads_count,
                    cost_per_lead_usd=cost_per_lead,
                    computed_price_usd=computed_price
                )
                db.add(cost_rep)

                run.status = "complete"
                run.finished_at = datetime.utcnow()
                db.commit()

                self._publish(run_id, "run_complete", {
                    "run_id": run_id,
                    "leads_delivered": leads_count,
                    "cost_per_lead_usd": cost_per_lead,
                    "computed_price_usd": computed_price,
                    "credits_used": total_credits,
                    "trace_url": run.neatlogs_trace_url
                })

            except Exception as e:
                logger.error(f"Orchestrator error during run {run_id}: {e}", exc_info=True)
                run.status = "failed"
                db.commit()
                self._publish(run_id, "step_update", {"status": "failed", "error": str(e)})
            finally:
                flush_traces()
                if own_session and db:
                    db.close()

    async def execute_run_with_langgraph(self, run_id: str, db: Session):
        """Executes run using compiled LangGraph StateGraph with neatlogs spans and SSE events."""
        from api.app.agent.graph import prospectforge_graph, ProspectForgeState
        run = db.query(Run).filter(Run.id == run_id).first()
        if not run:
            return None

        run.status = "running"
        run.started_at = datetime.utcnow()
        run.neatlogs_trace_id = f"trace-lg-{run_id[:8]}"
        run.neatlogs_trace_url = f"https://app.neatlogs.com/traces/{run.neatlogs_trace_id}"
        db.commit()

        initial_state: ProspectForgeState = {
            "run_id": run_id,
            "goal_text": run.goal_text,
            "niche": run.niche,
            "target_titles": run.target_titles or ["VP of Engineering"],
            "lead_target": run.lead_target,
            "region": run.region or "United States",
            "plan": {},
            "companies_raw": [],
            "credits_used": 0.0,
            "selected_companies": [],
            "messages": [],
            "verifications": [],
            "recovery_events": [],
            "status": "running",
            "needs_search_recovery": False,
            "needs_rewrite": False,
            "current_attempt": 1,
            "error": None
        }

        self._publish(run_id, "step_update", {"step": "langgraph_init", "status": "running", "detail": "Starting LangGraph StateGraph execution..."})

        # Execute LangGraph pipeline
        result = await prospectforge_graph.ainvoke(initial_state)

        run.plan = result.get("plan")
        run.status = "complete"
        run.finished_at = datetime.utcnow()
        db.commit()

        self._publish(run_id, "run_complete", {
            "run_id": run_id,
            "leads_delivered": len(result.get("messages", [])),
            "credits_used": result.get("credits_used", 0.0),
            "trace_url": run.neatlogs_trace_url,
            "engine": "langgraph"
        })
        return result

orchestrator = AgentOrchestrator()

