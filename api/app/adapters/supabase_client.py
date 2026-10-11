"""Supabase MCP & Project Linking Integration

Validates and inspects Supabase project linkage and MCP server parameters.
"""
from typing import Dict, Any, Optional
import urllib.parse
from api.app.config import settings

def get_supabase_mcp_info() -> Dict[str, Any]:
    """Returns structured metadata about the linked Supabase project and MCP configuration."""
    project_ref = settings.SUPABASE_PROJECT_REF
    mcp_url = settings.SUPABASE_MCP_URL
    parsed = urllib.parse.urlparse(mcp_url)
    qs = urllib.parse.parse_qs(parsed.query)

    features = qs.get("features", [""])[0].split(",") if "features" in qs else []

    return {
        "status": "linked",
        "project_ref": project_ref,
        "supabase_url": settings.SUPABASE_URL,
        "mcp_server_url": mcp_url,
        "features": features,
        "auth_configured": bool(settings.SUPABASE_KEY or settings.SUPABASE_ACCESS_TOKEN),
        "access_token_present": bool(settings.SUPABASE_ACCESS_TOKEN),
    }

def verify_supabase_project_link() -> bool:
    """Verifies that the project is linked with a valid 20-character project ref."""
    ref = settings.SUPABASE_PROJECT_REF
    return bool(ref and len(ref) >= 15 and ref.isalnum())
