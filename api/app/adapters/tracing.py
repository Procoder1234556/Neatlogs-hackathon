import os
import logging
from contextlib import contextmanager
from typing import Optional, Any, Dict
from api.app.config import settings

logger = logging.getLogger("prospectforge.tracing")

try:
    import neatlogs
except ImportError:
    neatlogs = None

_neatlogs_initialized = False

def init_tracing() -> bool:
    global _neatlogs_initialized
    if _neatlogs_initialized:
        return True
    try:
        import neatlogs
        api_key = settings.NEATLOGS_API_KEY or os.getenv("NEATLOGS_API_KEY")
        if api_key and api_key != "demo-neatlogs-key":
            tags = [settings.NEATLOGS_WORKFLOW_NAME] if settings.NEATLOGS_WORKFLOW_NAME else None
            neatlogs.init(api_key=api_key, tags=tags)
            _neatlogs_initialized = True
            logger.info("neatlogs telemetry initialized successfully.")
            return True
        else:
            logger.info("neatlogs running in local mock/offline mode.")
    except Exception as e:
        logger.warning(f"neatlogs initialization deferred or running in local mode: {e}")
    return False

# Eager attempt on module load
init_tracing()


class DummySpan:
    def __init__(self, name: str, kind: str = "WORKFLOW"):
        self.name = name
        self.kind = kind
        self.attributes: Dict[str, Any] = {}

    def set_attribute(self, key: str, value: Any):
        self.attributes[key] = value

    def set_error(self, error: Exception):
        self.attributes["error"] = str(error)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_val:
            self.set_error(exc_val)
        return False


@contextmanager
def trace_span(name: str, kind: str = "WORKFLOW", attributes: Optional[Dict[str, Any]] = None):
    """
    Context manager that starts a neatlogs span if available, with graceful fallback.
    Kind options: WORKFLOW, AGENT, CHAIN, TOOL, GUARDRAIL
    """
    span_obj = None
    if _neatlogs_initialized and neatlogs is not None:
        try:
            with neatlogs.trace(name, kind=kind) as s:
                if attributes:
                    for k, v in attributes.items():
                        s.set_attribute(k, v)
                yield s
                return
        except Exception as e:
            logger.debug(f"Span tracing fallback: {e}")

    # Fallback dummy span
    dummy = DummySpan(name, kind)
    if attributes:
        for k, v in attributes.items():
            dummy.set_attribute(k, v)
    yield dummy


def wrap_llm_client(client: Any) -> Any:
    """Wraps boto3 bedrock-runtime client with neatlogs if initialized."""
    if _neatlogs_initialized and neatlogs is not None:
        try:
            return neatlogs.wrap(client)
        except Exception as e:
            logger.warning(f"neatlogs.wrap() fallback: {e}")
    return client


def flush_traces():
    if _neatlogs_initialized and neatlogs is not None:
        try:
            neatlogs.flush()
        except Exception:
            pass


def shutdown_traces():
    if _neatlogs_initialized and neatlogs is not None:
        try:
            neatlogs.shutdown()
        except Exception:
            pass
