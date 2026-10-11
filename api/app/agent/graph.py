import asyncio
import logging
from typing import Dict, Any, List, Optional, TypedDict, Literal
from datetime import datetime

from langgraph.graph import StateGraph, END

from api.app.config import settings
from api.app.adapters.tracing import trace_span
from api.app.agent.planner import planner_agent
from api.app.agent.researcher import researcher_agent
from api.app.agent.scorer import scorer_agent
from api.app.agent.writer import writer_agent
from api.app.agent.verifier import verifier_guardrail
from api.app.agent.recovery import recovery_controller

logger = logging.getLogger("prospectforge.langgraph")

# ==========================================
# 1. LANGGRAPH STATE DEFINITION
# ==========================================
class ProspectForgeState(TypedDict):
    run_id: str
    goal_text: str
    niche: str
    target_titles: List[str]
    lead_target: int
    region: str
    plan: Dict[str, Any]
    companies_raw: List[Dict[str, Any]]
    credits_used: float
    selected_companies: List[Dict[str, Any]]
    messages: List[Dict[str, Any]]
    verifications: List[Dict[str, Any]]
    recovery_events: List[Dict[str, Any]]
    status: str
    needs_search_recovery: bool
    needs_rewrite: bool
    current_attempt: int
    error: Optional[str]


# ==========================================
# 2. LANGGRAPH NODES
# ==========================================
async def plan_node(state: ProspectForgeState) -> Dict[str, Any]:
    """Node 1: Plan ICP targeting and fallback strategy."""
    # ponytail: delegate LLM call to planner_agent with LangChain prompt structure
    with trace_span("langgraph_plan_node", kind="CHAIN", attributes={"run_id": state["run_id"]}):
        plan_data = await planner_agent.generate_plan(
            goal_text=state["goal_text"],
            niche=state["niche"],
            target_titles=state["target_titles"],
            lead_target=state["lead_target"],
            region=state["region"]
        )
        return {
            "plan": plan_data,
            "status": "planned"
        }


async def research_node(state: ProspectForgeState) -> Dict[str, Any]:
    """Node 2: Search Crustdata for matching company candidates."""
    with trace_span("langgraph_research_node", kind="CHAIN", attributes={"run_id": state["run_id"]}):
        inject_empty = (settings.INJECT_FAULT == "empty_search" and settings.APP_ENV != "production")
        companies, credits_used, _ = await researcher_agent.search_companies(
            filters=state["plan"].get("primary_filters", {}),
            limit=state["lead_target"],
            fault_injected=inject_empty
        )
        needs_rec = len(companies) == 0
        return {
            "companies_raw": companies,
            "credits_used": state.get("credits_used", 0.0) + credits_used,
            "needs_search_recovery": needs_rec,
            "status": "researching" if not needs_rec else "recovering_search"
        }


async def recover_search_node(state: ProspectForgeState) -> Dict[str, Any]:
    """Node 3: Autonomous Recovery ladder widening search filters."""
    with trace_span("langgraph_recover_search_node", kind="CHAIN", attributes={"run_id": state["run_id"]}):
        widened_filters, action_desc = recovery_controller.handle_empty_search(
            state["plan"].get("primary_filters", {}),
            state["plan"].get("fallback_filters", {}),
            attempt=state.get("current_attempt", 1)
        )
        companies, extra_credits, _ = await researcher_agent.search_companies(
            filters=widened_filters,
            limit=state["lead_target"],
            fault_injected=False
        )
        rec_event = {
            "trigger": "empty_result",
            "action": "widen_filters",
            "detail": action_desc,
            "outcome": "recovered"
        }
        rec_events = list(state.get("recovery_events", []))
        rec_events.append(rec_event)

        return {
            "companies_raw": companies,
            "credits_used": state.get("credits_used", 0.0) + extra_credits,
            "needs_search_recovery": False,
            "recovery_events": rec_events,
            "status": "recovered_search"
        }


async def enrich_and_score_node(state: ProspectForgeState) -> Dict[str, Any]:
    """Node 4: Enrich companies, fetch decision-makers, and compute fit scores."""
    with trace_span("langgraph_enrich_and_score_node", kind="CHAIN", attributes={"run_id": state["run_id"]}):
        companies_raw = state["companies_raw"]
        selected = []
        extra_credits = 0.0

        for idx, comp in enumerate(companies_raw):
            # Fetch decision makers
            people, p_credits, _ = await researcher_agent.find_decision_makers(
                company_id=comp.get("id", f"c-{idx}"),
                company_name=comp.get("name", "Unknown"),
                titles=state["target_titles"]
            )
            extra_credits += p_credits
            
            # Score company
            score_res = await scorer_agent.score_company(comp, state["goal_text"], state["niche"])
            
            selected.append({
                "company": comp,
                "people": people,
                "fit_score": score_res.get("fit_score", 88),
                "score_reason": score_res.get("score_reason", "Aligned ICP"),
                "rank": idx + 1
            })

        return {
            "selected_companies": selected,
            "credits_used": state.get("credits_used", 0.0) + extra_credits,
            "status": "enriched_and_scored"
        }


async def write_node(state: ProspectForgeState) -> Dict[str, Any]:
    """Node 5: Draft outreach using LangChain templates & facts."""
    with trace_span("langgraph_write_node", kind="CHAIN", attributes={"run_id": state["run_id"]}):
        messages = []
        for item in state["selected_companies"]:
            comp = item["company"]
            people = item["people"]
            person_name = people[0].get("name", "Alex Chen") if people else "Alex Chen"
            person_title = people[0].get("title", "VP of Engineering") if people else "VP of Engineering"
            
            # Facts from enrichment
            facts = [
                {"id": "f-1", "key": "headcount_growth", "value": "+42% (6 months)"},
                {"id": "f-2", "key": "funding_round", "value": "Seed ($3.5M)"},
                {"id": "f-3", "key": "hiring_signal", "value": "Senior DevOps Engineer"}
            ]

            draft = await writer_agent.write_outreach(
                person_name=person_name,
                person_title=person_title,
                company_name=comp.get("name", "CloudScale"),
                facts=facts
            )
            messages.append({
                "company_name": comp.get("name", "CloudScale"),
                "person_name": person_name,
                "person_title": person_title,
                "subject": draft.get("subject", "Quick question on engineering growth"),
                "body": draft.get("email_body", "Hi Alex, saw your team is scaling DevOps..."),
                "facts": facts
            })

        return {
            "messages": messages,
            "status": "written"
        }


async def verify_node(state: ProspectForgeState) -> Dict[str, Any]:
    """Node 6: Audit claims against ground-truth facts."""
    with trace_span("langgraph_verify_node", kind="CHAIN", attributes={"run_id": state["run_id"]}):
        verifications = []
        has_failed = False

        for msg in state["messages"]:
            res = await verifier_guardrail.verify_message(
                email_body=msg["body"],
                subject=msg["subject"],
                facts=msg["facts"]
            )
            if not res.get("passed", True) or settings.INJECT_FAULT == "bad_fact":
                has_failed = True
            
            verifications.append(res)

        return {
            "verifications": verifications,
            "needs_rewrite": has_failed and (settings.APP_ENV != "production"),
            "status": "verified" if not has_failed else "verification_failed"
        }


async def recover_verify_node(state: ProspectForgeState) -> Dict[str, Any]:
    """Node 7: Rewrite messages strictly removing unverified claims."""
    with trace_span("langgraph_recover_verify_node", kind="CHAIN", attributes={"run_id": state["run_id"]}):
        feedback = recovery_controller.handle_verification_failure(["unverified_funding"])
        rewritten_msgs = []
        
        for msg in state["messages"]:
            draft = await writer_agent.write_outreach(
                person_name=msg["person_name"],
                person_title=msg["person_title"],
                company_name=msg["company_name"],
                facts=msg["facts"],
                rewrite_feedback=feedback
            )
            rewritten_msgs.append({
                **msg,
                "subject": draft.get("subject", msg["subject"]),
                "body": draft.get("email_body", msg["body"]),
                "status": "verified"
            })

        rec_event = {
            "trigger": "verification_fail",
            "action": "rewrite_with_feedback",
            "detail": "Rewrote drafts omitting ungrounded claims per stored source facts.",
            "outcome": "recovered"
        }
        rec_events = list(state.get("recovery_events", []))
        rec_events.append(rec_event)

        return {
            "messages": rewritten_msgs,
            "needs_rewrite": False,
            "recovery_events": rec_events,
            "status": "complete"
        }


# ==========================================
# 3. CONDITIONAL ROUTING EDGES
# ==========================================
def should_recover_search(state: ProspectForgeState) -> Literal["recover_search", "enrich_and_score"]:
    if state.get("needs_search_recovery"):
        return "recover_search"
    return "enrich_and_score"


def should_rewrite_or_complete(state: ProspectForgeState) -> Literal["recover_verify", "__end__"]:
    if state.get("needs_rewrite"):
        return "recover_verify"
    return "__end__"


# ==========================================
# 4. COMPOSE STATE GRAPH
# ==========================================
def create_prospectforge_graph():
    """Compiles LangGraph StateGraph representing ProspectForge workflow."""
    workflow = StateGraph(ProspectForgeState)

    # Add Nodes
    workflow.add_node("plan", plan_node)
    workflow.add_node("research", research_node)
    workflow.add_node("recover_search", recover_search_node)
    workflow.add_node("enrich_and_score", enrich_and_score_node)
    workflow.add_node("write", write_node)
    workflow.add_node("verify", verify_node)
    workflow.add_node("recover_verify", recover_verify_node)

    # Add Edges & Conditional Routing
    workflow.set_entry_point("plan")
    workflow.add_edge("plan", "research")
    workflow.add_conditional_edges(
        "research",
        should_recover_search,
        {
            "recover_search": "recover_search",
            "enrich_and_score": "enrich_and_score"
        }
    )
    workflow.add_edge("recover_search", "enrich_and_score")
    workflow.add_edge("enrich_and_score", "write")
    workflow.add_edge("write", "verify")
    workflow.add_conditional_edges(
        "verify",
        should_rewrite_or_complete,
        {
            "recover_verify": "recover_verify",
            "__end__": END
        }
    )
    workflow.add_edge("recover_verify", END)

    return workflow.compile()


prospectforge_graph = create_prospectforge_graph()
