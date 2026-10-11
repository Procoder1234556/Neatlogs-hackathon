import asyncio
import json
import logging
from typing import Dict, List
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from api.app.agent.orchestrator import orchestrator

logger = logging.getLogger("prospectforge.events")

router = APIRouter(prefix="/api/v1/runs", tags=["events"])

# Active SSE listener queues per run_id
_subscribers: Dict[str, List[asyncio.Queue]] = {}

def publish_event(run_id: str, event_data: dict):
    if run_id in _subscribers:
        for q in _subscribers[run_id]:
            try:
                q.put_nowait(event_data)
            except asyncio.QueueFull:
                pass

# Hook orchestrator to event publisher
orchestrator.event_bus = publish_event

@router.get("/{run_id}/events")
async def stream_run_events(run_id: str):
    """Streams live Server-Sent Events (SSE) for step updates, recovery, and completion."""
    queue = asyncio.Queue(maxsize=100)
    if run_id not in _subscribers:
        _subscribers[run_id] = []
    _subscribers[run_id].append(queue)

    async def event_generator():
        # Emit initial ping
        yield f"event: connected\ndata: {json.dumps({'status': 'listening', 'run_id': run_id})}\n\n"
        try:
            while True:
                # Wait for next event or send keepalive comment every 15s
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=15.0)
                    event_type = event.get("type", "message")
                    data_str = json.dumps(event)
                    yield f"event: {event_type}\ndata: {data_str}\n\n"
                    if event_type == "run_complete":
                        break
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
        finally:
            if run_id in _subscribers and queue in _subscribers[run_id]:
                _subscribers[run_id].remove(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
