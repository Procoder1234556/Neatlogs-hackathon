import logging
from typing import List, Dict, Any, Tuple, Optional
from api.app.adapters.crustdata_client import crustdata_client
from api.app.adapters.firecrawl_client import firecrawl_client
from api.app.adapters.tracing import trace_span

logger = logging.getLogger("prospectforge.researcher")

class ResearcherAgent:
    """Discovers target companies and identifies matching decision-makers."""

    async def search_companies(
        self,
        filters: Dict[str, Any],
        limit: int = 15,
        fault_injected: bool = False,
        goal_text: str = "",
        niche: str = ""
    ) -> Tuple[List[Dict[str, Any]], float, str]:
        with trace_span("researcher", kind="AGENT", attributes={"limit": limit, "fault_injected": fault_injected}) as span:
            companies = []
            credits = 0.0
            req_hash = "search-init"

            if not fault_injected:
                try:
                    companies, credits, req_hash = await crustdata_client.company_search(
                        filters,
                        limit=limit,
                        fault_injected=fault_injected
                    )
                except Exception as ex:
                    logger.warning(f"Crustdata search failed: {ex}")
                    companies = []

            # Filter out generic community groups, conferences, and directories
            valid_companies = [
                c for c in companies
                if not any(kw in c.get("name", "").lower() for kw in ["community", "conference", "institute", "meetup", "learner", "training"])
            ]

            # If Crustdata returns sparse, generic, or empty results, invoke Firecrawl intelligence fallback!
            if len(valid_companies) < min(3, limit) and not fault_injected:
                logger.info("Crustdata results sparse or directory-heavy. Invoking Firecrawl web intelligence fallback.")
                span.set_attribute("fallback_triggered", "firecrawl")
                filters_query = filters.get("query", "") if isinstance(filters, dict) else ""
                filters_niche = filters.get("niche", "DevOps & Cloud Infrastructure") if isinstance(filters, dict) else "DevOps & Cloud Infrastructure"
                fc_query = goal_text or filters_query or "DevOps infrastructure startups hiring"
                fc_companies, fc_latency, fc_hash = await firecrawl_client.search_companies(
                    query=fc_query,
                    niche=niche or filters_niche,
                    limit=limit
                )
                if fc_companies:
                    span.set_attribute("firecrawl_candidates_count", len(fc_companies))
                    return fc_companies, credits + 1.5, fc_hash

            span.set_attribute("companies_found", len(valid_companies or companies))
            span.set_attribute("credits_used", credits)
            return (valid_companies or companies), credits, req_hash

    async def find_decision_makers(
        self,
        company_id: str,
        company_name: str,
        titles: List[str],
        known_decision_makers: Optional[List[Dict[str, Any]]] = None
    ) -> Tuple[List[Dict[str, Any]], float, str]:
        with trace_span("decision_maker_discovery", kind="TOOL", attributes={"company": company_name}) as span:
            if known_decision_makers and len(known_decision_makers) > 0:
                span.set_attribute("source", "firecrawl_extracted")
                return known_decision_makers, 0.5, f"known-{company_id}"

            people, credits, req_hash = await crustdata_client.person_search(
                company_id=company_id,
                company_name=company_name,
                titles=titles
            )
            span.set_attribute("people_found", len(people))
            span.set_attribute("credits_used", credits)
            return people, credits, req_hash

researcher_agent = ResearcherAgent()

