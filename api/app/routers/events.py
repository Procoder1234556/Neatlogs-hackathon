import asyncio
import json
import logging
from typing import Dict, List
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from api.app.agent.orchestrator import orchestrator
from api.app.config import settings

logger = logging.getLogger("prospectforge.events")

router = APIRouter(prefix="/api/v1/runs", tags=["events"])

# Active SSE listener queues per run_id
_subscribers: Dict[str, List[asyncio.Queue]] = {}

# Terminal event types that signal the stream should close
_TERMINAL_EVENTS = {"run_complete", "run_failed"}


def publish_event(run_id: str, event_data: dict):
    if run_id in _subscribers:
        dead = []
        for q in list(_subscribers[run_id]):
            try:
                q.put_nowait(event_data)
            except asyncio.QueueFull:
                # Queue full means client is not consuming; mark for eviction.
                dead.append(q)
        for q in dead:
            try:
                _subscribers[run_id].remove(q)
            except ValueError:
                pass


# Hook orchestrator to event publisher
orchestrator.event_bus = publish_event


@router.get("/{run_id}/events")
async def stream_run_events(run_id: str):
    """Streams live Server-Sent Events (SSE) for step updates, recovery, and completion.

    Closes the stream when:
    - A terminal event (run_complete / run_failed) is received from the agent.
    - No events arrive for SSE_MAX_IDLE_SECONDS (configurable; default 360 s).
    - The client disconnects.
    """
    queue: asyncio.Queue = asyncio.Queue(maxsize=200)
    _subscribers.setdefault(run_id, []).append(queue)

    async def event_generator():
        try:
            # Emit initial ping
            yield f"event: connected\ndata: {json.dumps({'status': 'listening', 'run_id': run_id})}\n\n"

            idle_budget = settings.SSE_MAX_IDLE_SECONDS
            keepalive_interval = settings.SSE_KEEPALIVE_SECONDS
            elapsed_idle = 0.0

            while True:
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=keepalive_interval)
                    elapsed_idle = 0.0  # reset idle counter on any real event
                    event_type = event.get("type", "message")
                    data_str = json.dumps(event)
                    yield f"event: {event_type}\ndata: {data_str}\n\n"
                    if event_type in _TERMINAL_EVENTS:
                        break
                except asyncio.TimeoutError:
                    # Send keepalive comment to prevent proxy/firewall timeout
                    yield ": keepalive\n\n"
                    elapsed_idle += keepalive_interval
                    if elapsed_idle >= idle_budget:
                        logger.warning(
                            f"SSE stream for run {run_id} idle for {elapsed_idle:.0f}s; closing."
                        )
                        yield f"event: run_failed\ndata: {json.dumps({'run_id': run_id, 'error': 'Stream idle timeout', 'status': 'failed'})}\n\n"
                        break
        finally:
            if run_id in _subscribers:
                try:
                    _subscribers[run_id].remove(queue)
                except ValueError:
                    pass
                if not _subscribers[run_id]:
                    _subscribers.pop(run_id, None)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
