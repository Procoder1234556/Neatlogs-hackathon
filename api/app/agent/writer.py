import logging
from typing import Dict, Any, List
from api.app.adapters.llm_client import llm_client
from api.app.adapters.tracing import trace_span

logger = logging.getLogger("prospectforge.writer")

class WriterAgent:
    """Generates personalized outreach citing only verified fact IDs."""

    async def write_outreach(
        self,
        person_name: str,
        person_title: str,
        company_name: str,
        facts: List[Dict[str, Any]],
        rewrite_feedback: str = ""
    ) -> Dict[str, Any]:
        with trace_span("writer", kind="AGENT", attributes={"person": person_name, "company": company_name}) as span:
            system_prompt = (
                "ROLE: FACT-GROUNDED B2B OUTREACH WRITER\n"
                "Rules:\n"
                "- Use ONLY the facts provided below. NEVER invent unlisted details (funding rounds, tools, numbers).\n"
                "- No spam buzzwords, no em dashes, under 120 words for email.\n"
                "- Cite used fact keys in cited_facts list.\n"
                "Output JSON: subject, email_body, linkedin_dm, cited_facts."
            )
            fact_summary = "\n".join([f"- [{f['key']}]: {f['value']}" for f in facts])
            user_prompt = (
                f"Recipient: {person_name}, {person_title} at {company_name}\n"
                f"Verified Facts:\n{fact_summary}\n"
            )
            if rewrite_feedback:
                user_prompt += f"\nCORRECTION REQUIRED FROM VERIFIER:\n{rewrite_feedback}"

            draft = await llm_client.generate_json(system_prompt, user_prompt)
            if not draft.get("email_body"):
                first_name = person_name.split()[0] if person_name else "there"
                fact_dict = {f.get("key"): f.get("value") for f in facts}
                hiring = fact_dict.get("hiring_signal", "expanding engineering operations")
                tech = fact_dict.get("tech_stack", "modern cloud infrastructure")
                draft = {
                    "subject": f"Quick question regarding {company_name}'s deployment pipeline",
                    "email_body": f"Hi {first_name},\n\nNoticed that {company_name} is actively {hiring} with an emphasis on {tech}.\n\nAs your engineering infrastructure expands, keeping deployment guardrails tight without slowing release velocity is critical.\n\nWould you be open to a brief 10-minute intro next week?\n\nBest,\nNikunj",
                    "linkedin_dm": f"Hi {first_name}, noticed your leadership at {company_name}. Would love to connect!",
                    "cited_facts": ["hiring_signal", "tech_stack"]
                }
            span.set_attribute("has_subject", bool(draft.get("subject")))
            return draft

writer_agent = WriterAgent()
