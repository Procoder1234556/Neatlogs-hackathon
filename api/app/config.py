from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Service & Auth
    APP_ENV: str = "development"
    SESSION_SECRET: str = "development-secret-key-32-bytes-minimum-length-needed-here"
    DEMO_ACCESS_CODE: str = "NEATLOGS2026"
    DATABASE_URL: str = "sqlite:///./prospectforge.db"

    # neatlogs Telemetry
    NEATLOGS_API_KEY: str = Field(default_factory=lambda: os.getenv("NEATLOGS_API_KEY", "demo-neatlogs-key"))
    NEATLOGS_WORKFLOW_NAME: str = "prospectforge"
    NEATLOGS_ENDPOINT: Optional[str] = None

    # AWS Bedrock
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_SESSION_TOKEN: Optional[str] = None
    AWS_BEARER_TOKEN_BEDROCK: Optional[str] = None
    BEDROCK_MODEL_STRONG: str = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    BEDROCK_MODEL_FAST: str = "anthropic.claude-3-5-haiku-20241022-v1:0"

    # Crustdata REST API
    CRUSTDATA_API_KEY: Optional[str] = Field(default_factory=lambda: os.getenv("CRUSTDATA_API_KEY", "demo-crustdata-key"))
    CRUSTDATA_API_VERSION: str = "2025-11-01"
    CRUSTDATA_BASE_URL: str = "https://api.crustdata.com"

    # Safety, Budget & Fault Injection
    MAX_CREDITS_PER_RUN: int = 500
    DAILY_CREDIT_CAP: int = 5000
    INJECT_FAULT: Optional[str] = None  # empty_search | rate_limit | bad_fact

    # Supabase & MCP Integration
    SUPABASE_PROJECT_REF: str = "jbfyxtbyheyuylptreud"
    SUPABASE_URL: str = Field(default_factory=lambda: os.getenv("SUPABASE_URL", "https://jbfyxtbyheyuylptreud.supabase.co"))
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_MCP_URL: str = "https://mcp.supabase.com/mcp?project_ref=jbfyxtbyheyuylptreud&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"

settings = Settings()
