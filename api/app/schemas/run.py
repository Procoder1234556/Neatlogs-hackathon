from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime

class RunCreate(BaseModel):
    niche: str = Field(..., max_length=120, description="Niche or market sector")
    goal_text: str = Field(..., min_length=10, max_length=2000, description="ICP definition in plain English")
    target_titles: List[str] = Field(..., min_length=1, max_length=10, description="Job titles to target")
    region: Optional[str] = Field(default="United States", max_length=80)
    lead_target: int = Field(default=15, ge=5, le=25, description="Requested number of leads (5..25)")
    credit_budget: int = Field(default=250, ge=50, le=1000, description="Credit budget cap")
    access_code: Optional[str] = None

class RunEstimateRequest(BaseModel):
    niche: str
    goal_text: str
    target_titles: List[str]
    lead_target: int = 15
    region: Optional[str] = "United States"

class RunEstimateResponse(BaseModel):
    lead_target: int
    estimated_credits: int
    estimated_tokens: int
    estimated_cost_usd: float
    estimated_duration_seconds: int
    suggested_credit_budget: int
    unit_cost_estimate: float

class StepResponse(BaseModel):
    id: str
    name: str
    status: str
    attempts: int
    detail: Optional[str] = None
    duration_ms: Optional[int] = None
    cost_credits: float
    cost_usd: float

class RecoveryEventResponse(BaseModel):
    id: str
    trigger: str
    action: str
    detail: str
    outcome: str
    attempt: int
    created_at: datetime

class RunResponse(BaseModel):
    id: str
    niche: str
    goal_text: str
    target_titles: List[str]
    region: Optional[str]
    lead_target: int
    credit_budget: int
    status: str
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    mode: Optional[str] = "live"
    neatlogs_trace_id: Optional[str] = None
    neatlogs_trace_url: Optional[str] = None
    created_at: datetime

class RunDetailResponse(RunResponse):
    plan: Optional[Dict[str, Any]] = None
    steps: List[StepResponse] = []
    recovery_events: List[RecoveryEventResponse] = []
    leads_count: int = 0
    claims_verified_count: int = 0
    total_credits_used: float = 0.0
    total_cost_usd: float = 0.0

class FactResponse(BaseModel):
    id: str
    key: str
    value: str
    source: str
    fetched_at: datetime

class VerificationResponse(BaseModel):
    id: str
    passed: bool
    unsupported_claims: Optional[List[str]] = None
    claims_checked: Optional[int] = 3
    claims_failed: Optional[int] = 0
    quality_score: int
    audit_notes: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    channel: str
    subject: Optional[str] = None
    body: str
    used_fact_ids: List[str]
    status: str
    version: int
    verification: Optional[VerificationResponse] = None

class PersonResponse(BaseModel):
    id: str
    full_name: str
    title: str
    profile_url: Optional[str] = None
    is_primary: bool
    messages: List[MessageResponse] = []
    facts: List[FactResponse] = []

class CompanyLeadResponse(BaseModel):
    id: str
    name: str
    domain: str
    fit_score: int
    score_reason: Optional[str] = None
    score_breakdown: Optional[Dict[str, Any]] = None
    rank: Optional[int] = None
    status: str
    people: List[PersonResponse] = []
    facts: List[FactResponse] = []

class SeriesPoint(BaseModel):
    timestamp: str
    step_name: str
    credits: float
    tokens: int
    cost_usd: float
    recovery_marker: Optional[str] = None

class SignalDimension(BaseModel):
    name: str
    score: int
    delta: int  # e.g. +5% vs baseline
    direction: str  # up, down, neutral

class PricingTier(BaseModel):
    plan: str
    price_headline: str
    price_per_lead: float
    target_margin: str
    features: List[str]

class PricingResponse(BaseModel):
    measured_median_cost_per_lead: float
    target_gross_margin: float
    computed_price_per_lead: float
    tiers: List[PricingTier]
    cfo_assumptions: Dict[str, Any]

class RunSummaryResponse(BaseModel):
    total_runs: int
    total_leads_delivered: int
    total_claims_verified: int
    avg_fit_score: int
    total_credits_used: float
    total_cost_usd: float

class SourceHealthItem(BaseModel):
    source: str
    status: str
    detail: str
    checked_at: datetime
    balance: Optional[float] = None

class SourcesHealthResponse(BaseModel):
    sources: List[SourceHealthItem]

class PublicSettingsResponse(BaseModel):
    app_env: str
    version: str
    daily_credit_cap: int
    max_credits_per_run: int
    target_gross_margin: float
    bedrock_model_fast: str
    bedrock_model_strong: str

class FilterSuggestionResponse(BaseModel):
    field: str
    query: str
    suggestions: List[str]
