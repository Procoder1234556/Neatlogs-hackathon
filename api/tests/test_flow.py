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
