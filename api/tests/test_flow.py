import pytest
from api.app.schemas.run import RunEstimateRequest
from api.app.routers.runs import estimate_run
from api.app.agent.recovery import recovery_controller
from api.app.routers.pricing import get_pricing

def test_run_estimate():
    req = RunEstimateRequest(
        niche="Fintech",
        goal_text="Early-stage startups hiring DevOps",
        target_titles=["VP Engineering"],
        lead_target=10
    )
    res = estimate_run(req)
    assert res.lead_target == 10
    assert res.estimated_credits == 90
    assert res.estimated_cost_usd > 0
    assert res.suggested_credit_budget == 140

def test_recovery_controller_widening():
    current_filters = {"headcount_min": 10, "headcount_max": 50}
    widened, detail = recovery_controller.handle_empty_search(current_filters, {}, attempt=1)
    assert widened["headcount_max"] == 150
    assert "Series B" in widened["funding_stages"]
    assert "Attempt 1" in detail

def test_pricing_unit_economics():
    pricing = get_pricing()
    assert pricing.measured_median_cost_per_lead == 0.28
    assert pricing.target_gross_margin == 0.75
    assert pricing.computed_price_per_lead == 1.12 or pricing.computed_price_per_lead == 1.15
    assert len(pricing.tiers) >= 3

def test_supabase_mcp_check():
    from api.app.adapters.supabase_client import get_supabase_mcp_info, verify_supabase_project_link
    assert verify_supabase_project_link() is True
    info = get_supabase_mcp_info()
    assert info["project_ref"] == "jbfyxtbyheyuylptreud"
    assert "https://jbfyxtbyheyuylptreud.supabase.co" in info["supabase_url"]
    assert "project_ref=jbfyxtbyheyuylptreud" in info["mcp_server_url"]
    assert "database" in info["features"]
    assert "functions" in info["features"]

def test_system_endpoints():
    from fastapi.testclient import TestClient
    from api.app.main import app
    with TestClient(app) as client:
        # 0. Liveness & Readiness checks
        r_health = client.get("/health")
        assert r_health.status_code == 200
        assert r_health.json()["status"] == "healthy"

        r_health_api = client.get("/api/v1/health")
        assert r_health_api.status_code == 200
        assert r_health_api.json()["status"] == "healthy"

        r_ready = client.get("/readyz")
        assert r_ready.status_code == 200
        assert r_ready.json()["status"] == "ready"

        # 1. Sources health
        r_sources = client.get("/api/v1/sources/health")
        assert r_sources.status_code == 200
        sources = r_sources.json()["sources"]
        assert len(sources) >= 4
        source_names = [s["source"] for s in sources]
        assert "neatlogs" in source_names
        assert "Crustdata" in source_names
        assert "AWS Bedrock" in source_names
        assert "Supabase" in source_names

        # 2. Public settings
        r_settings = client.get("/api/v1/settings/public")
        assert r_settings.status_code == 200
        data = r_settings.json()
        assert data["daily_credit_cap"] == 5000
        assert data["target_gross_margin"] == 0.75

        # 3. Filter suggestions
        r_suggest = client.get("/api/v1/filters/suggest?field=titles&q=DevOps")
        assert r_suggest.status_code == 200
        assert "Head of DevOps" in r_suggest.json()["suggestions"]

        # 4. Runs summary
        r_sum = client.get("/api/v1/runs/summary")
        assert r_sum.status_code == 200
        assert r_sum.json()["total_runs"] >= 1

        # 5. Run detail
        r_detail = client.get("/api/v1/runs/demo-seed-001")
        assert r_detail.status_code == 200
        d_json = r_detail.json()
        assert d_json["id"] == "demo-seed-001"
        assert d_json["mode"] in ["live", "fault_injection", "replay"]
        assert len(d_json["steps"]) >= 4

        # 6. CSV export sanitization (7_SECURITY.md OWASP A05)
        r_csv = client.get("/api/v1/runs/demo-seed-001/export.csv")
        assert r_csv.status_code == 200
        assert "text/csv" in r_csv.headers["content-type"]
        assert "attachment" in r_csv.headers["content-disposition"]


def test_rate_limit_and_verification_recovery():
    # Rate limit exponential backoff ladder
    backoff, detail = recovery_controller.handle_rate_limit(attempt=1)
    assert backoff == 2
    assert "exponential backoff" in detail

    backoff2, _ = recovery_controller.handle_rate_limit(attempt=2)
    assert backoff2 == 4

    # Verification failure rewrite loop feedback
    feedback = recovery_controller.handle_verification_failure(["unverified_funding", "fake_headcount"])
    assert "unverified_funding" in feedback
    assert "ground-truth facts" in feedback


@pytest.mark.asyncio
async def test_langgraph_workflow():
    from api.app.agent.graph import prospectforge_graph, ProspectForgeState
    assert prospectforge_graph is not None

    test_state: ProspectForgeState = {
        "run_id": "test-lg-verify-01",
        "goal_text": "Series A DevOps Startups",
        "niche": "DevOps & Cloud Infrastructure",
        "target_titles": ["VP of Engineering"],
        "lead_target": 2,
        "region": "United States",
        "plan": {},
        "companies_raw": [],
        "credits_used": 0.0,
        "selected_companies": [],
        "messages": [],
        "verifications": [],
        "recovery_events": [],
        "status": "queued",
        "needs_search_recovery": False,
        "needs_rewrite": False,
        "current_attempt": 1,
        "error": None
    }

    result = await prospectforge_graph.ainvoke(test_state)
    assert result["status"] in ["verified", "complete"]
    assert len(result["messages"]) >= 2
    assert result["credits_used"] > 0

def test_healthz_and_readyz():
    from fastapi.testclient import TestClient
    from api.app.main import app
    with TestClient(app) as client:
        # Liveness check
        r_live = client.get("/healthz")
        assert r_live.status_code == 200
        assert r_live.json()["status"] == "healthy"

        # Readiness check
        r_ready = client.get("/readyz")
        assert r_ready.status_code == 200
        data = r_ready.json()
        assert data["status"] == "ready"
        assert data["database"] == "connected"

@pytest.mark.asyncio
async def test_mock_fallback_gate_enforcement():
    from api.app.config import settings
    from api.app.adapters.crustdata_client import CrustdataClient
    from api.app.adapters.llm_client import LLMClient

    # Test with mock fallback disabled (production simulation)
    orig_mock = settings.ALLOW_MOCK_FALLBACK
    orig_key = settings.CRUSTDATA_API_KEY
    orig_groq = settings.GROQ_API_KEY
    orig_openai = settings.OPENAI_API_KEY
    orig_openrouter = settings.OPENROUTER_API_KEY
    try:
        settings.ALLOW_MOCK_FALLBACK = False
        settings.CRUSTDATA_API_KEY = "invalid-or-missing"
        settings.GROQ_API_KEY = None
        settings.OPENAI_API_KEY = None
        settings.OPENROUTER_API_KEY = None

        c_client = CrustdataClient()
        c_client.api_key = None

        with pytest.raises(RuntimeError) as exc_info:
            await c_client.company_search({"query": "devops"}, limit=5)
        assert "mock fallback is disabled" in str(exc_info.value) or "unavailable" in str(exc_info.value)

        # Verify LLM client raises instead of returning fabricated output
        l_client = LLMClient()
        l_client._bedrock = None
        with pytest.raises(RuntimeError) as exc_llm:
            await l_client.generate_json("PLANNER", "find startups")
        assert "Refusing fabricated agent synthesis" in str(exc_llm.value) or "unavailable" in str(exc_llm.value) or "mock fallback is disabled" in str(exc_llm.value)
    finally:
        settings.ALLOW_MOCK_FALLBACK = orig_mock
        settings.CRUSTDATA_API_KEY = orig_key
        settings.GROQ_API_KEY = orig_groq
        settings.OPENAI_API_KEY = orig_openai
        settings.OPENROUTER_API_KEY = orig_openrouter



