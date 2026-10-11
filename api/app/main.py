import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.app.config import settings
from api.app.db.session import engine, Base, SessionLocal
from api.app.db.models import Run, RunStep, Company, Person, Fact, Message, Verification, CostReport, RecoveryEvent
from api.app.adapters.tracing import flush_traces, shutdown_traces
from api.app.routers import runs, events, pricing

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("prospectforge.main")

def seed_demo_run():
    """Seeds an initial verified demo run for instant showcase."""
    db = SessionLocal()
    try:
        existing = db.query(Run).first()
        if existing:
            return

        demo_run = Run(
            id="demo-seed-001",
            niche="DevOps & Cloud Infrastructure",
            goal_text="Early-stage devtool startups in the US with 10 to 50 employees hiring senior DevOps engineers or SREs. Target VP of Engineering or Head of Platform.",
            target_titles=["VP of Engineering", "Head of Platform", "CTO"],
            region="United States",
            lead_target=5,
            credit_budget=200,
            status="complete",
            plan={
                "strategy": "Dual-pass discovery focusing on verified Seed-to-Series A startups hiring platform roles.",
                "primary_filters": {"headcount_min": 10, "headcount_max": 50, "funding_stages": ["Seed", "Series A"]},
                "fallback_filters": {"headcount_min": 10, "headcount_max": 100, "funding_stages": ["Seed", "Series A", "Series B"]}
            },
            owner_id="demo-user",
            neatlogs_trace_id="trace-demo-seed-001",
            neatlogs_trace_url="https://app.neatlogs.com/traces/trace-demo-seed-001"
        )
        db.add(demo_run)
        db.flush()

        # Add steps
        steps = [
            RunStep(run_id=demo_run.id, name="plan", status="done", attempts=1, detail="Strategy established", duration_ms=450, cost_usd=0.01),
            RunStep(run_id=demo_run.id, name="research", status="recovered", attempts=2, detail="Recovered after filter widening: 5 candidates", duration_ms=1200, cost_credits=45, cost_usd=0.45),
            RunStep(run_id=demo_run.id, name="enrich", status="done", attempts=1, detail="Extracted headcount growth and hiring signals", duration_ms=1500, cost_credits=50, cost_usd=0.50),
            RunStep(run_id=demo_run.id, name="score", status="done", attempts=1, detail="Ranked 5 fit companies", duration_ms=600, cost_usd=0.05),
            RunStep(run_id=demo_run.id, name="write", status="done", attempts=1, detail="Drafted fact-grounded outreach", duration_ms=1100, cost_usd=0.12),
            RunStep(run_id=demo_run.id, name="verify", status="done", attempts=1, detail="Audited 5 claims; 100% verified", duration_ms=800, cost_usd=0.08)
        ]
        db.add_all(steps)

        # Recovery event
        rec = RecoveryEvent(
            run_id=demo_run.id,
            trigger="empty_result",
            action="widen_filters",
            detail="Initial search returned 0 results. Widened headcount filter to 10..100 and added Series A.",
            outcome="recovered",
            attempt=1
        )
        db.add(rec)

        # Seed 1 company, person, facts, message, verification
        comp = Company(
            run_id=demo_run.id,
            name="CloudScale Systems",
            domain="cloudscalesystems.io",
            fit_score=94,
            score_reason="Exact ICP fit: 42% headcount growth, active senior DevOps hiring, Seed round closed.",
            rank=1,
            status="selected"
        )
        db.add(comp)
        db.flush()

        person = Person(
            company_id=comp.id,
            full_name="Alex Chen",
            title="VP of Engineering",
            profile_url="https://linkedin.com/in/alex-chen-cloudscale",
            is_primary=True
        )
        db.add(person)
        db.flush()

        f1 = Fact(run_id=demo_run.id, subject_type="company", subject_id=comp.id, key="headcount_growth", value="+42% in 6 months", source="crustdata:company_enrich")
        f2 = Fact(run_id=demo_run.id, subject_type="company", subject_id=comp.id, key="funding_stage", value="Seed ($3.5M)", source="crustdata:company_enrich")
        f3 = Fact(run_id=demo_run.id, subject_type="company", subject_id=comp.id, key="hiring_signal", value="Hiring Senior DevOps Engineer", source="crustdata:company_enrich")
        f4 = Fact(run_id=demo_run.id, subject_type="person", subject_id=person.id, key="career_highlight", value="Former Staff Infrastructure Lead at Stripe", source="crustdata:person_search")
        db.add_all([f1, f2, f3, f4])
        db.flush()

        msg = Message(
            person_id=person.id,
            channel="email",
            subject="Quick question on CloudScale deployment guardrails",
            body=(
                "Hi Alex,\n\n"
                "Saw that CloudScale grew engineering headcount by 42% over the last two quarters and is actively hiring senior DevOps engineers.\n\n"
                "Given your background scaling infrastructure at Stripe, would love to share how teams in your stage streamline deployment guardrails without slowing release velocity.\n\n"
                "Open to a brief chat next Tuesday?\n\nBest,\nNikunj"
            ),
            used_fact_ids=[f1.id, f3.id, f4.id],
            status="verified",
            version=1
        )
        db.add(msg)
        db.flush()

        ver = Verification(
            message_id=msg.id,
            passed=True,
            unsupported_claims=[],
            quality_score=98,
            audit_notes="All claims verified against Crustdata company growth, hiring records, and career history."
        )
        db.add(ver)

        cost = CostReport(
            run_id=demo_run.id,
            credits_total=95.0,
            llm_usd=0.26,
            crustdata_usd_equiv=0.95,
            total_usd=1.26,
            leads_delivered=5,
            cost_per_lead_usd=0.252,
            computed_price_usd=1.05
        )
        db.add(cost)

        db.commit()
        logger.info("Demo showcase run seeded successfully.")
    except Exception as e:
        logger.warning(f"Demo seeding skipped: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed demo run
    Base.metadata.create_all(bind=engine)
    seed_demo_run()
    yield
    # Shutdown: flush and close telemetry
    flush_traces()
    shutdown_traces()

app = FastAPI(
    title="ProspectForge Agent Service",
    version="1.0.0",
    description="Autonomous B2B research agent with verified claims and neatlogs telemetry.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

from api.app.adapters.supabase_client import get_supabase_mcp_info, verify_supabase_project_link

# Include Routers
app.include_router(runs.router)
app.include_router(events.router)
app.include_router(pricing.router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ProspectForge",
        "version": "1.0.0",
        "environment": settings.APP_ENV
    }

@app.get("/api/supabase/check")
def supabase_mcp_check():
    return {
        "linked": verify_supabase_project_link(),
        "info": get_supabase_mcp_info()
    }
