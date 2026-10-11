from fastapi import APIRouter
from api.app.schemas.run import PricingResponse, PricingTier

router = APIRouter(prefix="/api/v1/pricing", tags=["pricing"])

@router.get("", response_model=PricingResponse)
def get_pricing():
    measured_cost = 0.28
    target_margin = 0.75
    computed_price = round(measured_cost / (1.0 - target_margin), 2)

    return PricingResponse(
        measured_median_cost_per_lead=measured_cost,
        target_gross_margin=target_margin,
        computed_price_per_lead=computed_price,
        tiers=[
            PricingTier(
                plan="Pay As You Go",
                price_headline=f"${computed_price} / lead",
                price_per_lead=computed_price,
                target_margin="75% Gross Margin",
                features=[
                    "No monthly subscription",
                    "Grounded Crustdata research",
                    "Verifier anti-hallucination check",
                    "Live neatlogs trace link",
                    "CSV export with formula-injection guard"
                ]
            ),
            PricingTier(
                plan="Founder Starter",
                price_headline="$49 / month",
                price_per_lead=0.82,
                target_margin="71% Gross Margin",
                features=[
                    "4 runs per month (up to 60 verified leads)",
                    "Saved ICP templates",
                    "Automated recovery ladders",
                    "Email & LinkedIn variants",
                    "Direct support"
                ]
            ),
            PricingTier(
                plan="Growth & Agency",
                price_headline="$199 / month",
                price_per_lead=0.66,
                target_margin="73% Gross Margin",
                features=[
                    "15 runs per month (up to 300 verified leads)",
                    "Custom filter rules",
                    "Client-ready PDF/CSV cost reports",
                    "Multi-account credit pooling",
                    "Dedicated API webhooks"
                ]
            )
        ],
        cfo_assumptions={
            "crustdata_credit_price_usd": 0.01,
            "credits_per_lead": 9.0,
            "tokens_per_lead": 2200,
            "token_cost_per_lead_usd": 0.088,
            "recovery_overhead_rate": 0.15,
            "monthly_fixed_costs_usd": 35.0,
            "break_even_leads_per_month": 42
        }
    )
