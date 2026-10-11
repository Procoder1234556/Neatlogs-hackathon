import logging
from typing import List, Dict, Any, Tuple
from api.app.adapters.crustdata_client import crustdata_client
from api.app.adapters.tracing import trace_span

logger = logging.getLogger("prospectforge.researcher")

class ResearcherAgent:
    """Discovers target companies and identifies matching decision-makers."""

    async def search_companies(
        self,
        filters: Dict[str, Any],
        limit: int = 15,
        fault_injected: bool = False
    ) -> Tuple[List[Dict[str, Any]], float, str]:
        with trace_span("researcher", kind="AGENT", attributes={"limit": limit, "fault_injected": fault_injected}) as span:
            companies, credits, req_hash = await crustdata_client.company_search(
                filters,
                limit=limit,
                fault_injected=fault_injected
            )
            span.set_attribute("companies_found", len(companies))
            span.set_attribute("credits_used", credits)
            return companies, credits, req_hash

    async def find_decision_makers(
        self,
        company_id: str,
        company_name: str,
        titles: List[str]
    ) -> Tuple[List[Dict[str, Any]], float, str]:
        with trace_span("decision_maker_discovery", kind="TOOL", attributes={"company": company_name}) as span:
            people, credits, req_hash = await crustdata_client.person_search(
                company_id=company_id,
                company_name=company_name,
                titles=titles
            )
            span.set_attribute("people_found", len(people))
            span.set_attribute("credits_used", credits)
            return people, credits, req_hash

researcher_agent = ResearcherAgent()
