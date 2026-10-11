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



