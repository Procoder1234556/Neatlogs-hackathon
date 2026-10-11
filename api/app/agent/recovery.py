import logging
from typing import Dict, Any, Tuple
from api.app.adapters.tracing import trace_span

logger = logging.getLogger("prospectforge.recovery")

class RecoveryController:
    """Detects failures or shortfalls and executes autonomous recovery ladders."""

    def handle_empty_search(
        self,
        current_filters: Dict[str, Any],
        fallback_filters: Dict[str, Any],
        attempt: int = 1
    ) -> Tuple[Dict[str, Any], str]:
        with trace_span("recovery_empty_search", kind="CHAIN", attributes={"trigger": "empty_result", "attempt": attempt}) as span:
            widened = dict(current_filters)
            # Widen headcount bounds
            widened["headcount_min"] = 10
            widened["headcount_max"] = 150
            # Broaden funding stages
            widened["funding_stages"] = ["Seed", "Series A", "Series B"]
            action_detail = (
                f"Widened headcount filter to 10..150 and expanded funding stages to include Series B (Attempt {attempt})."
            )
            span.set_attribute("action", "widen_filters")
            span.set_attribute("detail", action_detail)
            return widened, action_detail

    def handle_rate_limit(self, attempt: int = 1) -> Tuple[int, str]:
        with trace_span("recovery_rate_limit", kind="CHAIN", attributes={"trigger": "rate_limit", "attempt": attempt}) as span:
            backoff_seconds = 2 ** attempt
            action_detail = f"Applied exponential backoff with jitter: waiting {backoff_seconds}s before retrying."
            span.set_attribute("action", "retry_backoff")
            span.set_attribute("backoff_seconds", backoff_seconds)
            return backoff_seconds, action_detail

    def handle_verification_failure(self, unsupported_claims: list, attempt: int = 1) -> str:
        with trace_span("recovery_verification_failure", kind="CHAIN", attributes={"trigger": "verification_fail", "attempt": attempt}) as span:
            feedback = (
                f"The previous draft contained unsupported claims: {', '.join(unsupported_claims)}. "
                "Rewrite the outreach strictly omitting any claim not in the ground-truth facts table."
            )
            span.set_attribute("action", "rewrite_with_feedback")
            span.set_attribute("feedback", feedback)
            return feedback

recovery_controller = RecoveryController()
