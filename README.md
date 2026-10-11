# ProspectForge

> **Autonomous B2B research and outreach agent with verified claims, autonomous recovery, and live telemetry.**  
> Built for the **neatlogs hackathon** (October 10–11, 2026).

[![neatlogs](https://img.shields.io/badge/Telemetry-neatlogs-indigo.svg)](https://app.neatlogs.com)
[![Crustdata](https://img.shields.io/badge/Data-Crustdata%20API-orange.svg)](https://crustdata.com)
[![AWS Bedrock](https://img.shields.io/badge/LLM-Claude%20on%20Bedrock-blue.svg)](https://aws.amazon.com/bedrock/)
[![Entire](https://img.shields.io/badge/Agent%20VCS-Entire-emerald.svg)](https://entire.io)
[![cfo.ai](https://img.shields.io/badge/Unit%20Economics-cfo.ai-green.svg)](https://cfo.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## The Problem & The Core Insight

Founders and outbound sales reps spend **10+ hours per week** doing manual prospecting: finding fit accounts, identifying real decision-makers, and drafting personalized messages.

Existing tools fail in two distinct ways:
1. **Static databases (Apollo, ZoomInfo):** Stale data, zero reasoning, high false-positive fit.
2. **Generic AI email writers (ChatGPT wrappers):** Hallucinate funding rounds, invent tech stacks, and generate spammy templates that damage brand reputation.
3. **Black-box opacity:** Nobody shows the source, nobody proves why a lead was selected, and nobody tracks the real per-lead compute cost.

### The ProspectForge Solution
**ProspectForge** is a deterministic, observable B2B prospecting agent. Give it an ICP in plain English; it autonomously searches live company data, enriches real decision-makers, writes outreach citing stored data fields, **verifies every claim against raw evidence before shipping**, and recovers autonomously when data is sparse.

Every single claim in every email links directly to a verifiable field with a live timestamp, traced end-to-end in **neatlogs**.

---

## Key Features

- **Plain-English ICP Intake**: Input natural language criteria (niche, target titles, geography, lead volume) with instant pre-run cost and credit estimation.
- **Autonomous Planner with Fallback Strategies**: Translates goals into structured execution graphs with pre-computed recovery fallbacks.
- **Real-Time B2B Enrichment (Crustdata)**: Live query of company headcount, funding stage, tech stack, hiring signals, and decision-maker career history.
- **Fact-Grounded Outreach Writer**: Generates concise, personalized emails and LinkedIn messages using *only* stored factual entities.
- **Verification Guardrail (Anti-Hallucination)**: Verifier audits every generated claim against source fields. Unsupported claims trigger an automated rewrite loop (up to 2 iterations).
- **Self-Healing Recovery Controller**: Detects empty searches, rate-limits (429), or thin profiles; widens filters, applies backoff, and re-plans without human intervention.
- **Live Telemetry & Tracing (neatlogs)**: Full execution graph visualized in real time via Server-Sent Events (SSE) and deep-linked to neatlogs distributed traces.
- **Unit Economics Engine (cfo.ai)**: Computes live, measured cost per verified lead (Crustdata credits + Bedrock tokens) targeting >70% gross margins.

---

## System Architecture

```mermaid
graph TD
    User([User / Founder]) -->|1. Plain-English ICP & Budget| Web[Next.js Web UI]
    Web -->|2. POST /api/runs| API[FastAPI Orchestrator]
    
    subgraph Agent Core [ProspectForge Autonomous Engine]
        API --> Planner[1. Structured Planner]
        Planner --> Researcher[2. Researcher & Enricher]
        
        Researcher <-->|Crustdata REST API| CD[(Crustdata B2B Data)]
        Researcher --> Scorer[3. Fit Scorer & Ranker]
        Scorer --> Writer[4. Fact-Grounded Writer]
        
        Writer <-->|Bedrock Converse API| Bedrock[(Claude 3.5 Sonnet)]
        Writer --> Verifier{5. Claim Verifier}
        
        Verifier -->|Unsupported Claim| Rewrite[Rewrite Loop (max 2)]
        Rewrite --> Writer
        
        Verifier -->|All Claims Verified| DB[(Postgres State)]
        
        Researcher -.->|Empty / 429 / Thin| Recovery[Recovery Controller]
        Recovery -.->|Widen Filters / Backoff| Researcher
    end

    subgraph Telemetry & Observability
        Agent Core -->|SDK Spans & Logs| NL[neatlogs Ingestion]
        NL --> LiveTrace[Live Trace Dashboard]
    end

    subgraph Business Engine
        DB --> CFO[cfo.ai Margin & Unit Economics Engine]
        CFO --> PricingPage[Dynamic Pricing & Cost Report]
    end
```

---

## Sponsor Technology Integrations

| Sponsor / Tool | Integration Depth | Implementation File | Purpose & Impact |
|---|---|---|---|
| **neatlogs** | Native SDK + CLI + Doctor | [`api/telemetry.py`](file:///d:/Neatlogs-hackathon/5_BACKEND_STRUCTURE.md) | Distributed agent tracing, custom span kinds (`WORKFLOW`, `AGENT`, `TOOL`, `GUARDRAIL`), live recovery logs. |
| **Crustdata** | REST API (`2025-11-01`) + CLI | [`api/crustdata_client.py`](file:///d:/Neatlogs-hackathon/5_BACKEND_STRUCTURE.md) | Live B2B company discovery, headcount/funding enrichment, decision-maker career history, credit metering. |
| **AWS Bedrock** | Boto3 Converse API | [`api/llm.py`](file:///d:/Neatlogs-hackathon/3_TECH_STACK.md) | Claude 3.5 Sonnet wrapped by `neatlogs.wrap()`, structured JSON schema outputs, strict prompt boundaries. |
| **cfo.ai** | Pricing & Unit Economics | [`api/pricing.py`](file:///d:/Neatlogs-hackathon/CFO_PLAN.md) | Live calculation of per-lead delivery costs, margin protection (>70%), dynamic pricing endpoint. |
| **Entire** | Agent VCS Checkpoints | `.entire/` | Checkpointing agent-generated code modifications with auditability. |

---

## Live Failure & Recovery Proof

Hackathon judges value seeing an agent survive real-world chaos. ProspectForge includes an integrated **Fault-Injection Switch** (`INJECT_FAULT=empty_search|rate_limit|bad_fact`):

1. **Trigger**: An overly narrow ICP returns zero accounts from Crustdata.
2. **Autonomous Detection**: Recovery controller catches the empty result before failing the run.
3. **Action Ladder**:
   - Widens headcount bounds (e.g., 20–50 → 10–100).
   - Relaxes funding stage requirements (Seed → Seed to Series A).
   - Dispatches fallback search query.
4. **Telemetry Evidence**: Emits a `recovery` span in neatlogs recording the trigger, action ladder, and resolution outcome.
5. **UI Confirmation**: Real-time timeline displays an amber "Recovering" badge which transitions to green "Recovered after 1 attempt".

---

## Unit Economics (Powered by cfo.ai)

Every delivered lead is grounded in audited compute costs:

| Cost Component | Typical 15-Lead Run | Cost per Delivered Lead | Source / Measurement |
|---|---|---|---|
| **Crustdata Credits** | ~135 credits (~$1.35) | $0.090 | `X-Credits-Used` response headers logged in `tool_calls` |
| **Bedrock Tokens (Claude)** | ~45,000 tokens | $0.150 | Bedrock on-demand token metering via neatlogs |
| **Recovery / Retries Overhead** | ~15% compute margin | $0.036 | Logged recovery spans |
| **Hosting & Postgres Share** | Amortized infra | $0.024 | Platform baseline allocation |
| **Total Variable Cost** | — | **$0.300 / lead** | Measured sum |
| **Computed Price (@ 75% Margin)**| — | **$1.20 / lead** | Target gross margin enforcement |

---

## Quickstart

### Prerequisites
- Python 3.12+
- Node.js 22 or 24
- PostgreSQL 16+
- API Keys: `NEATLOGS_API_KEY`, `CRUSTDATA_API_KEY`, `AWS_BEARER_TOKEN_BEDROCK`

### 1. Backend Service (`api`)
```bash
cd api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run neatlogs health check
python -m neatlogs doctor --probe --json

# Run migrations & start server
alembic upgrade head
uvicorn main:app --reload --port 8000
```

### 2. Frontend Application (`web`)
```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

---

## Hackathon Judging Rubric Mapping

| Criterion | Weight | How ProspectForge Wins | Reference |
|---|---|---|---|
| **Agentic Execution** | **30%** | Full cycle: Plan → Search → Enrich → Score → Write → Verify → Self-Heal Recovery. | [`1_PRD.md`](file:///d:/Neatlogs-hackathon/1_PRD.md) |
| **Sponsor Integration** | **25%** | Deep, idiomatic use of neatlogs SDK/CLI, Crustdata B2B REST API, AWS Bedrock, and cfo.ai model. | [`3_TECH_STACK.md`](file:///d:/Neatlogs-hackathon/3_TECH_STACK.md) |
| **Demo & Presentation** | **20%** | 2m45s crisp live video featuring a visible failure injection, autonomous recovery, and live trace. | [`DEMO_SCRIPT.md`](file:///d:/Neatlogs-hackathon/DEMO_SCRIPT.md) |
| **Build in Public** | **15%** | Milestone updates on X showcasing actual neatlogs traces and architectural decisions. | [`BUILD_IN_PUBLIC.md`](file:///d:/Neatlogs-hackathon/BUILD_IN_PUBLIC.md) |
| **Viability & Originality**| **10%** | Real source-field citations eliminate hallucinations; verified unit economics ensure real-world business viability. | [`CFO_PLAN.md`](file:///d:/Neatlogs-hackathon/CFO_PLAN.md) |

---

## Project Documentation Index

- [1_PRD.md](file:///d:/Neatlogs-hackathon/1_PRD.md) — Product Requirements & Success Metrics
- [2_APP_FLOW.md](file:///d:/Neatlogs-hackathon/2_APP_FLOW.md) — End-to-end user journeys & recovery flows
- [3_TECH_STACK.md](file:///d:/Neatlogs-hackathon/3_TECH_STACK.md) — SDK versions, APIs, and client configurations
- [4_FRONTEND_GUIDELINES.md](file:///d:/Neatlogs-hackathon/4_FRONTEND_GUIDELINES.md) — UI architecture, states, and design system
- [5_BACKEND_STRUCTURE.md](file:///d:/Neatlogs-hackathon/5_BACKEND_STRUCTURE.md) — API schemas, DB models, and agent loops
- [6_IMPLEMENTATION_PLAN.md](file:///d:/Neatlogs-hackathon/6_IMPLEMENTATION_PLAN.md) — 36-hour build sequence & checkpoints
- [7_SECURITY.md](file:///d:/Neatlogs-hackathon/7_SECURITY.md) — Threat model, OWASP Top 10:2025, and ASVS controls
- [8_DYNAMIC_DESIGN.md](file:///d:/Neatlogs-hackathon/8_DYNAMIC_DESIGN.md) — Dynamic UI states, pricing calculator, and animations
- [CFO_PLAN.md](file:///d:/Neatlogs-hackathon/CFO_PLAN.md) — Business model, unit economics, and margin protection
- [DEMO_SCRIPT.md](file:///d:/Neatlogs-hackathon/DEMO_SCRIPT.md) — Second-by-second 2:45 demo video script & Q&A defense
- [BUILD_IN_PUBLIC.md](file:///d:/Neatlogs-hackathon/BUILD_IN_PUBLIC.md) — X posts & community build milestones
