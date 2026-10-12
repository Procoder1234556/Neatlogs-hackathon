import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Numeric, Boolean,
    DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from api.app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class Run(Base):
    __tablename__ = "runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    goal_text = Column(Text, nullable=False)
    niche = Column(String(120), nullable=False)
    target_titles = Column(JSON, nullable=False)  # list of strings
    region = Column(String(80), nullable=True)
    lead_target = Column(Integer, nullable=False, default=15)
    credit_budget = Column(Integer, nullable=False, default=300)
    status = Column(String(30), nullable=False, default="queued")  # queued, running, complete, partial, failed
    plan = Column(JSON, nullable=True)
    owner_id = Column(String(36), nullable=False, default=generate_uuid, index=True)
    share_token_hash = Column(String(64), nullable=True)
    share_expires_at = Column(DateTime, nullable=True)
    neatlogs_trace_id = Column(String(120), nullable=True)
    neatlogs_trace_url = Column(String(255), nullable=True)
    mode = Column(String(30), nullable=False, default="live")  # live, replay, fault_injection // ponytail: simple string enum
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    steps = relationship("RunStep", back_populates="run", cascade="all, delete-orphan")
    companies = relationship("Company", back_populates="run", cascade="all, delete-orphan")
    tool_calls = relationship("ToolCall", back_populates="run", cascade="all, delete-orphan")
    recovery_events = relationship("RecoveryEvent", back_populates="run", cascade="all, delete-orphan")
    cost_report = relationship("CostReport", uselist=False, back_populates="run", cascade="all, delete-orphan")


class RunStep(Base):
    __tablename__ = "run_steps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    run_id = Column(String(36), ForeignKey("runs.id"), nullable=False, index=True)
    name = Column(String(30), nullable=False)  # plan, research, enrich, score, write, verify
    status = Column(String(30), nullable=False, default="queued")  # queued, running, recovering, recovered, degraded, failed, done
    attempts = Column(Integer, default=0)
    detail = Column(Text, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    cost_credits = Column(Numeric(10, 2), default=0)
    cost_usd = Column(Numeric(10, 4), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    run = relationship("Run", back_populates="steps")


class Company(Base):
    __tablename__ = "companies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    run_id = Column(String(36), ForeignKey("runs.id"), nullable=False, index=True)
    external_id = Column(String(120), nullable=True)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=False)
    fit_score = Column(Integer, default=0)
    score_reason = Column(Text, nullable=True)
    score_breakdown = Column(JSON, nullable=True)  # {dimension: {score: int, reason: str}} // ponytail: flexible jsonb
    rank = Column(Integer, nullable=True)
    status = Column(String(30), default="candidate")  # candidate, selected, dropped
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    run = relationship("Run", back_populates="companies")
    people = relationship("Person", back_populates="company", cascade="all, delete-orphan")


class Person(Base):
    __tablename__ = "people"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False, index=True)
    external_id = Column(String(120), nullable=True)
    full_name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    profile_url = Column(Text, nullable=True)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", back_populates="people")
    messages = relationship("Message", back_populates="person", cascade="all, delete-orphan")


class Fact(Base):
    __tablename__ = "facts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    run_id = Column(String(36), ForeignKey("runs.id"), nullable=False, index=True)
    subject_type = Column(String(20), nullable=False)  # company, person
    subject_id = Column(String(36), nullable=False, index=True)
    key = Column(String(80), nullable=False)  # headcount, funding_stage, tech_stack, growth_rate
    value = Column(Text, nullable=False)
    source = Column(String(120), nullable=False)  # crustdata:company_search
    fetched_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    person_id = Column(String(36), ForeignKey("people.id"), nullable=False, index=True)
    channel = Column(String(20), nullable=False, default="email")  # email, dm
    subject = Column(Text, nullable=True)
    body = Column(Text, nullable=False)
    used_fact_ids = Column(JSON, nullable=False, default=list)  # list of fact IDs
    version = Column(Integer, default=1)
    status = Column(String(20), default="draft")  # draft, verified, dropped
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    person = relationship("Person", back_populates="messages")
    verifications = relationship("Verification", back_populates="message", cascade="all, delete-orphan")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    message_id = Column(String(36), ForeignKey("messages.id"), nullable=False, index=True)
    passed = Column(Boolean, nullable=False)
    unsupported_claims = Column(JSON, nullable=True)  # list of strings
    claims_checked = Column(Integer, default=3)
    claims_failed = Column(Integer, default=0)
    quality_score = Column(Integer, default=100)
    audit_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    message = relationship("Message", back_populates="verifications")


class ToolCall(Base):
    __tablename__ = "tool_calls"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    run_id = Column(String(36), ForeignKey("runs.id"), nullable=False, index=True)
    step_id = Column(String(36), nullable=True)
    tool = Column(String(80), nullable=False)
    request_hash = Column(String(64), nullable=True)
    request_id = Column(String(80), nullable=True)
    endpoint = Column(String(120), nullable=True)
    status = Column(String(30), nullable=False, default="ok")  # ok, error, empty, rate_limited, cache_hit
    credits_used = Column(Numeric(10, 2), default=0)
    tokens_in = Column(Integer, default=0)
    tokens_out = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("Run", back_populates="tool_calls")


class RecoveryEvent(Base):
    __tablename__ = "recovery_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    run_id = Column(String(36), ForeignKey("runs.id"), nullable=False, index=True)
    step_id = Column(String(36), nullable=True)
    trigger = Column(String(40), nullable=False)  # empty_result, error, rate_limit, thin_data, verification_fail, shortfall
    action = Column(String(40), nullable=False)   # widen_filters, retry_backoff, switch_endpoint, replan, drop_item
    detail = Column(Text, nullable=False)
    outcome = Column(String(20), nullable=False, default="recovered")  # recovered, degraded
    attempt = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("Run", back_populates="recovery_events")


class CostReport(Base):
    __tablename__ = "cost_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    run_id = Column(String(36), ForeignKey("runs.id"), nullable=False, unique=True)
    credits_total = Column(Numeric(10, 2), default=0)
    llm_usd = Column(Numeric(10, 4), default=0)
    crustdata_usd_equiv = Column(Numeric(10, 4), default=0)
    total_usd = Column(Numeric(10, 4), default=0)
    leads_delivered = Column(Integer, default=0)
    cost_per_lead_usd = Column(Numeric(10, 4), default=0)
    computed_price_usd = Column(Numeric(10, 4), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("Run", back_populates="cost_report")


class ApiCache(Base):
    __tablename__ = "api_cache"

    key = Column(String(64), primary_key=True)
    response = Column(JSON, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class SourceHealth(Base):
    __tablename__ = "source_health"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    provider = Column(String(40), nullable=False, unique=True)  # Crustdata, neatlogs, AWS Bedrock
    status = Column(String(20), nullable=False, default="healthy")  # healthy, degraded, down
    detail = Column(Text, nullable=True)
    latency_p50_ms = Column(Integer, default=120)
    last_checked_at = Column(DateTime, default=datetime.utcnow)


class Setting(Base):
    __tablename__ = "settings"

    key = Column(String(80), primary_key=True)
    value = Column(JSON, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AccountPriceCache(Base):
    __tablename__ = "account_price_cache"

    endpoint = Column(String(120), primary_key=True)
    payload = Column(JSON, nullable=False)
    fetched_at = Column(DateTime, default=datetime.utcnow)

