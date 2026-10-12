import logging
from typing import Dict, Any, List
from api.app.adapters.llm_client import llm_client
from api.app.adapters.tracing import trace_span

logger = logging.getLogger("prospectforge.planner")

class PlannerAgent:
    """Turns plain-English ICP into ordered plan with primary and fallback filters."""

    async def generate_plan(
        self,
        goal_text: str,
        niche: str,
        target_titles: List[str],
        lead_target: int,
        region: str
    ) -> Dict[str, Any]:
        with trace_span("planner", kind="AGENT", attributes={"niche": niche, "lead_target": lead_target}) as span:
            system_prompt = (
                "ROLE: B2B OUTBOUND PLANNER\n"
                "Transform the user's ICP into a structured search and enrichment plan.\n"
                "Output JSON with: strategy, primary_filters, fallback_filters, enrichment_priorities."
            )
            user_prompt = (
                f"Niche: {niche}\n"
                f"ICP Goal: {goal_text}\n"
                f"Target Titles: {', '.join(target_titles)}\n"
                f"Lead Target: {lead_target}\n"
                f"Region: {region}"
            )
            plan = await llm_client.generate_json(system_prompt, user_prompt)
            # Ensure primary_filters reflect user goal_text
            # ponytail: extract keywords directly if missing from generated plan
            raw_filters = plan.get("primary_filters")
            if not isinstance(raw_filters, dict):
                primary_filters = {}
                plan["primary_filters"] = primary_filters
            else:
                primary_filters = raw_filters

            if not primary_filters.get("keywords") and not primary_filters.get("query"):
                goal_lower = (goal_text + " " + niche).lower()
                if any(w in goal_lower for w in ["blockchain", "blcokchain", "crypto", "web3", "defi"]):
                    primary_filters["keywords"] = ["Blockchain", "Web3", "Crypto"]
                elif any(w in goal_lower for w in ["ai", "machine learning", "llm"]):
                    primary_filters["keywords"] = ["Artificial Intelligence", "LLM", "Machine Learning"]
                elif any(w in goal_lower for w in ["security", "cyber", "devsecops"]):
                    primary_filters["keywords"] = ["Cybersecurity", "Cloud Security"]
                else:
                    primary_filters["keywords"] = [k for k in niche.split() if len(k) > 3][:3]
            span.set_attribute("strategy", plan.get("strategy", "Multi-pass search"))
            return plan

planner_agent = PlannerAgent()
