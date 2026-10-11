import logging
from typing import Dict, Any, List
from api.app.adapters.llm_client import llm_client
from api.app.adapters.tracing import trace_span

logger = logging.getLogger("prospectforge.scorer")

class ScorerAgent:
    """Scores each discovered company 0-100 against the ICP with a written reason."""

    async def score_company(
        self,
        company: Dict[str, Any],
        goal_text: str,
        niche: str
    ) -> Dict[str, Any]:
        with trace_span("fit_scorer", kind="AGENT", attributes={"company": company.get("name")}) as span:
            system_prompt = (
                "ROLE: B2B FIT SCORER\n"
                "Evaluate fit (0-100) based strictly on company data vs ICP.\n"
                "Output JSON with fit_score, score_reason, breakdown (headcount_fit, funding_fit, tech_fit, hiring_signals)."
            )
            user_prompt = (
                f"ICP Goal: {goal_text}\n"
                f"Niche: {niche}\n"
                f"Company Name: {company.get('name')}\n"
                f"Headcount: {company.get('headcount', {})}\n"
                f"Funding: {company.get('funding', {})}\n"
                f"Tech Stack: {company.get('technographics', [])}\n"
                f"Hiring Signals: {company.get('hiring_signals', [])}"
            )
            score_data = await llm_client.generate_json(system_prompt, user_prompt)
            score = score_data.get("fit_score", 85)
            span.set_attribute("fit_score", score)
            return score_data

scorer_agent = ScorerAgent()
