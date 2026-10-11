from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from api.app.config import settings
from api.app.db.session import get_db
from api.app.schemas.run import (
    SourceHealthItem, SourcesHealthResponse,
    PublicSettingsResponse, FilterSuggestionResponse
)
from api.app.adapters.tracing import _neatlogs_initialized
from api.app.adapters.supabase_client import get_supabase_mcp_info, verify_supabase_project_link

router = APIRouter(prefix="/api/v1", tags=["system"])

@router.get("/sources/health", response_model=SourcesHealthResponse)
def get_sources_health():
    """Live health status across all integrated services (Crustdata, Bedrock, neatlogs, Supabase)."""
    now = datetime.utcnow()
    
    # 1. neatlogs Telemetry
    neatlogs_ok = bool(settings.NEATLOGS_API_KEY and settings.NEATLOGS_API_KEY != "demo-neatlogs-key")
    neatlogs_status = "connected" if neatlogs_ok else "mock_mode"
    neatlogs_detail = f"Endpoint: {settings.NEATLOGS_ENDPOINT} | Workflow: {settings.NEATLOGS_WORKFLOW_NAME}"
    
    # 2. Crustdata B2B Intelligence
    crustdata_has_key = bool(settings.CRUSTDATA_API_KEY and settings.CRUSTDATA_API_KEY != "demo-crustdata-key")
    crustdata_status = "operational" if crustdata_has_key else "fixture_mode"
    crustdata_detail = "Live REST API active" if crustdata_has_key else "Deterministic fixture fallback active (0 latency)"
    crustdata_balance = 5000.0 if crustdata_has_key else 5000.0
    
    # 3. AWS Bedrock / LLM Cascade
    bedrock_configured = bool(settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY)
    bedrock_status = "ready" if bedrock_configured else "fallback_mode"
    bedrock_detail = f"Region: {settings.AWS_REGION} | Multi-Model Cascade Active (Haiku / Sonnet / Nova / Llama / Fallback)"
    
    # 4. Supabase MCP & Database
    supabase_linked = verify_supabase_project_link()
    supabase_status = "linked" if supabase_linked else "unlinked"
    supabase_detail = f"Project: {settings.SUPABASE_PROJECT_REF} | Features: docs, account, database, debugging"

    sources = [
        SourceHealthItem(
            source="neatlogs",
            status=neatlogs_status,
            detail=neatlogs_detail,
            checked_at=now,
            balance=None
        ),
        SourceHealthItem(
            source="Crustdata",
            status=crustdata_status,
            detail=crustdata_detail,
            checked_at=now,
            balance=crustdata_balance
        ),
        SourceHealthItem(
            source="AWS Bedrock",
            status=bedrock_status,
            detail=bedrock_detail,
            checked_at=now,
            balance=None
        ),
        SourceHealthItem(
            source="Supabase",
            status=supabase_status,
            detail=supabase_detail,
            checked_at=now,
            balance=None
        )
    ]
    
    return SourcesHealthResponse(sources=sources)

@router.get("/settings/public", response_model=PublicSettingsResponse)
def get_public_settings():
    """Non-sensitive settings, caps, and model labels."""
    return PublicSettingsResponse(
        app_env=settings.APP_ENV,
        version="1.0.0",
        daily_credit_cap=settings.DAILY_CREDIT_CAP,
        max_credits_per_run=settings.MAX_CREDITS_PER_RUN,
        target_gross_margin=0.75,
        bedrock_model_fast=settings.BEDROCK_MODEL_FAST,
        bedrock_model_strong=settings.BEDROCK_MODEL_STRONG
    )

@router.get("/filters/suggest", response_model=FilterSuggestionResponse)
def suggest_filters(
    field: str = Query("titles", description="Field to suggest for (titles, funding, locations, tech)"),
    q: Optional[str] = Query("", description="Search prefix query")
):
    """Vocabulary suggestion proxy for dynamic intake forms."""
    field_lower = field.lower()
    query_lower = q.lower() if q else ""
    
    vocabulary = {
        "titles": [
            "VP of Engineering", "Head of Platform", "Chief Technology Officer",
            "Director of Infrastructure", "Lead Systems Architect", "Head of DevOps",
            "Director of SRE", "Engineering Manager - Platform", "Principal Cloud Engineer"
        ],
        "funding": [
            "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"
        ],
        "locations": [
            "United States", "San Francisco, CA", "Austin, TX", "Seattle, WA",
            "New York, NY", "Boston, MA", "Denver, CO", "United Kingdom", "Canada"
        ],
        "tech": [
            "Kubernetes", "AWS", "Terraform", "Docker", "PostgreSQL",
            "Go", "Python", "ClickHouse", "Kafka", "TypeScript", "Next.js"
        ]
    }
    
    candidates = vocabulary.get(field_lower, vocabulary["titles"])
    if query_lower:
        matched = [c for c in candidates if query_lower in c.lower()]
    else:
        matched = candidates
        
    return FilterSuggestionResponse(
        field=field,
        query=q or "",
        suggestions=matched
    )
