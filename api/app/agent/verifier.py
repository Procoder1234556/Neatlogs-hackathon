import logging
from typing import Dict, Any, List
from api.app.adapters.llm_client import llm_client
from api.app.adapters.tracing import trace_span

logger = logging.getLogger("prospectforge.verifier")

class VerifierGuardrail:
    """Audits generated claims against raw facts. Blocks any hallucinated claims."""

    async def verify_message(
        self,
        email_body: str,
        subject: str,
        facts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        with trace_span("verifier_guardrail", kind="GUARDRAIL", attributes={"guardrail": "fact_checker"}) as span:
            system_prompt = (
                "ROLE: STRICT FACT-CHECKING AUDITOR\n"
                "Audit the email draft against the ground-truth facts.\n"
                "If the text claims anything not supported by the facts (e.g. higher funding stage, false headcount), set passed: false and list unsupported_claims.\n"
                "Output JSON: passed (bool), unsupported_claims (list[str]), quality_score (0..100), audit_notes (str)."
            )
            fact_summary = "\n".join([f"- [{f['key']}]: {f['value']}" for f in facts])
            user_prompt = (
                f"Ground-Truth Facts:\n{fact_summary}\n\n"
                f"Subject: {subject}\n"
                f"Body to Audit:\n{email_body}"
            )
            result = await llm_client.generate_json(system_prompt, user_prompt)
            passed = result.get("passed", True)
            span.set_attribute("verification_passed", passed)
            span.set_attribute("quality_score", result.get("quality_score", 95))
            return result

verifier_guardrail = VerifierGuardrail()
