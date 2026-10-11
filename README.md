# ProspectForge

> **Autonomous B2B research and outreach platform featuring anti-hallucination claim verification, self-healing recovery loops, and distributed telemetry.**  
> Built for the **neatlogs hackathon** (October 2026).

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![neatlogs](https://img.shields.io/badge/Telemetry-neatlogs-indigo.svg)](https://app.neatlogs.com)
[![Crustdata](https://img.shields.io/badge/Data-Crustdata%20API-orange.svg)](https://crustdata.com)
[![AWS Bedrock](https://img.shields.io/badge/LLM-Claude%203.5%20Sonnet-blue.svg)](https://aws.amazon.com/bedrock/)
[![cfo.ai](https://img.shields.io/badge/Unit%20Economics-cfo.ai-green.svg)](https://cfo.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

Founders and outbound sales teams lose dozens of hours every week manually researching target accounts, identifying decision-makers, and drafting outreach. Current automated solutions suffer from severe failure modes:

1. **Hallucination Risk**: Generic AI writers invent funding rounds, tech stacks, and team changes, degrading brand reputation and sender credibility.
2. **Fragility & Silent Failures**: Traditional scrapers and API chains fail silently when search queries return 0 hits, encounter rate limits, or encounter thin prospect profiles.
3. **Observability Void**: Teams lack distributed tracing to inspect intermediate agent reasoning or calculate the true cost per delivered lead.

**ProspectForge** solves this through a deterministic, observable multi-agent pipeline:
- **100% Fact-Grounded Outreach**: Every factual assertion links to verified data attributes from live B2B enrichment.
- **Anti-Hallucination Guardrails**: A claim verification engine audits generated messages against stored facts; ungrounded statements trigger an automated rewrite loop.
- **Self-Healing Recovery**: If queries return empty results, hit rate limits, or encounter sparse data, an autonomous recovery controller broadens filters and applies backoff without human intervention.
- **Real-Time Telemetry**: Full execution graphs are streamed via Server-Sent Events (SSE) and traced end-to-end in **neatlogs**.
- **Audited Unit Economics**: Compute and API costs are tracked in real-time, enforcing target gross margins (>70%) inspired by **cfo.ai**.

---

## System Architecture

```mermaid
graph TD
    User([Founder / Operator]) -->|1. Plain-English ICP & Budget| Web[Next.js 15 Web Dashboard]
    Web -->|2. POST /api/runs| API[FastAPI Orchestrator]
    
    subgraph Agent Core [ProspectForge Multi-Agent Pipeline]
        API --> Planner[1. Structured Planner]
        Planner --> Researcher[2. Researcher & Enricher]
        
        Researcher <-->|Crustdata REST API| CD[(Crustdata B2B Intelligence)]
        Researcher --> Scorer[3. Fit Scorer & Ranker]
        Scorer --> Writer[4. Fact-Grounded Writer]
        
        Writer <-->|AWS Bedrock Converse API| Bedrock[(Claude 3.5 Sonnet)]
        Writer --> Verifier{5. Claim Verifier}
        
        Verifier -->|Unsupported Claim| Rewrite[Rewrite Loop (max 2)]
        Rewrite --> Writer
        
        Verifier -->|All Claims Verified| DB[(SQLite / PostgreSQL)]
        
        Researcher -.->|Empty Search / 429 / Sparse Data| Recovery[Recovery Controller]
        Recovery -.->|Filter Widening / Backoff| Researcher
    end

    subgraph Observability & Telemetry
        Agent Core -->|Structured Spans & Events| NL[neatlogs Ingestion]
        API -->|Server-Sent Events| Web
        NL --> LiveTrace[Distributed Traces Dashboard]
    end

    subgraph Unit Economics Engine
        DB --> CFO[cfo.ai Margin & Unit Economics Engine]
        CFO --> Web
    end
```

---

## Core Capabilities

### 1. Structured Multi-Agent DAG
The pipeline transitions through 6 distinct agent stages, each producing auditable step artifacts:
- **Planner** (`api/app/agent/planner.py`): Translates plain-English ICP intake into structured queries, search filters, and fallback contingencies.
- **Researcher & Enricher** (`api/app/agent/researcher.py`): Queries company headcount, growth trajectories, funding history, and decision-maker roles via Crustdata.
- **Fit Scorer & Ranker** (`api/app/agent/scorer.py`): Scores each candidate against target criteria with transparent reasoning.
- **Fact-Grounded Writer** (`api/app/agent/writer.py`): Drafts hyper-personalized emails and LinkedIn messages using only verified entities.
- **Claim Verifier** (`api/app/agent/verifier.py`): Audits every sentence against stored facts. Flags any hallucinated entity and triggers an automatic rewrite.
- **Recovery Controller** (`api/app/agent/recovery.py`): Catches upstream edge cases (zero results, rate limits) and applies adaptive widening ladders.

### 2. Live Telemetry & Distributed Tracing
Integrated natively with **neatlogs**:
- Custom span categorization (`WORKFLOW`, `AGENT`, `TOOL`, `GUARDRAIL`).
- Real-time Server-Sent Events (`/api/runs/{id}/events`) updating the visual DAG on the frontend.
- Direct links from each run to full distributed trace trees on neatlogs.

### 3. Unit Economics Engine (cfo.ai)
Real-time tracking of variable delivery costs:
- **Crustdata API Credits**: Measured from live response headers.
- **Bedrock Tokens**: Input/output token metering mapped to exact USD spend.
- **Margin Protection**: Automatically calculates recommended per-lead pricing to maintain a 70%+ gross margin.

| Cost Component | Typical 15-Lead Run | Cost per Delivered Lead | Measurement Method |
|---|---|---|---|
| **Crustdata Credits** | ~135 credits (~$1.35) | $0.090 | `X-Credits-Used` response headers |
| **Bedrock Tokens (Claude)** | ~45,000 tokens | $0.150 | Token consumption metrics |
| **Recovery / Retries Overhead**| ~15% compute margin | $0.036 | Logged recovery spans |
| **Hosting & Database Share** | Baseline infra | $0.024 | Platform baseline allocation |
| **Total Variable Cost** | — | **$0.300 / lead** | Measured sum |
| **Target Price (@ 75% Margin)**| — | **$1.20 / lead** | Dynamic pricing algorithm |

---

## Codebase Structure

```
Neatlogs-hackathon/
├── api/                             # FastAPI Backend Service
│   ├── app/
│   │   ├── adapters/                # External Service Integrations
│   │   │   ├── crustdata_client.py  # Crustdata REST API client & mock fallbacks
│   │   │   ├── llm_client.py        # AWS Bedrock Converse API client
│   │   │   └── tracing.py           # neatlogs distributed tracing SDK adapter
│   │   ├── agent/                   # Multi-Agent Core Engine
│   │   │   ├── orchestrator.py      # End-to-end execution runner & event emitter
│   │   │   ├── planner.py           # ICP parser & search plan generator
│   │   │   ├── researcher.py        # Account enrichment & people finder
│   │   │   ├── scorer.py            # Account scoring & ranking logic
│   │   │   ├── writer.py            # Fact-grounded message synthesis
│   │   │   ├── verifier.py          # Claim verification & rewrite controller
│   │   │   └── recovery.py          # Self-healing recovery controller
│   │   ├── db/                      # Persistence Layer
│   │   │   ├── models.py            # SQLAlchemy models (Runs, Prospects, Facts, etc.)
│   │   │   └── session.py           # Async database session & SQLite engine
│   │   ├── routers/                 # API Endpoints
│   │   │   ├── events.py            # Server-Sent Events (SSE) router
│   │   │   ├── pricing.py           # cfo.ai unit economics & dynamic pricing
│   │   │   └── runs.py              # Run creation, retrieval, and recovery triggers
│   │   ├── config.py                # Environment configuration & defaults
│   │   └── main.py                  # FastAPI application entrypoint & demo seeder
│   ├── tests/
│   │   └── test_flow.py             # Pytest suite for end-to-end pipeline & recovery
│   └── requirements.txt             # Python dependencies
│
└── web/                             # Next.js 15 Frontend Dashboard
    ├── public/                      # Static assets & icons
    ├── src/
    │   ├── app/
    │   │   ├── globals.css          # Theme styles & custom utilities
    │   │   ├── layout.tsx           # Dashboard layout shell
    │   │   └── page.tsx             # Interactive dashboard (DAG, citations, economics)
    │   └── lib/
    │       └── api.ts               # Backend client & SSE event consumer
    ├── package.json                 # Node.js dependencies & scripts
    └── tsconfig.json                # TypeScript configuration
```

---

## Quickstart Guide

### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: 20.x or higher (npm included)
- Optional: API keys for `neatlogs`, `Crustdata`, or `AWS Bedrock` (the system automatically runs in offline simulated mode if keys are omitted).

---

### 1. Backend Setup

```bash
# Navigate to the API directory
cd api

# Create and activate a virtual environment
# On macOS / Linux:
python3 -m venv .venv
source .venv/bin/activate

# On Windows:
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI development server
uvicorn app.main:app --reload --port 8000
```

The backend is now live at `http://localhost:8000`.  
Interactive Swagger API documentation is available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to the Web directory
cd web

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

Open `http://localhost:3000` in your browser.  
The application automatically starts with a pre-seeded, fully verified demo run showcasing live claims, citations, recovery events, and unit economics.

---

### 3. Running Automated Tests

To run the pipeline and unit economics test suite:

```bash
# Run pytest from the api directory
cd api
pytest tests/
```

Or from the repository root:
```bash
python -m pytest api/tests
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/runs` | Creates a new prospecting run from a natural-language ICP intake. |
| `GET` | `/api/runs` | Returns all past runs with execution status and summary stats. |
| `GET` | `/api/runs/{id}` | Retrieves detailed run state including prospects, facts, verified messages, and recovery logs. |
| `GET` | `/api/runs/{id}/events` | Server-Sent Events (SSE) stream for real-time DAG status updates. |
| `POST` | `/api/runs/{id}/recovery` | Manually triggers or inspects a self-healing recovery action. |
| `POST` | `/api/runs/estimate` | Computes pre-run credit and cost estimates based on target volume. |
| `GET` | `/api/pricing` | Returns cfo.ai unit economics analysis, cost breakdowns, and margin pricing tiers. |
| `GET` | `/health` | Service health check returning uptime and runtime environment. |

---

## Environment Variables

All settings have safe defaults and operate smoothly in local/demo mode. To connect live external services, configure an `api/.env` file:

| Variable | Default | Purpose |
|---|---|---|
| `APP_ENV` | `development` | Deployment environment (`development` / `production`). |
| `DATABASE_URL` | `sqlite:///./prospectforge.db` | Database connection string (SQLite or PostgreSQL). |
| `NEATLOGS_API_KEY` | `demo-neatlogs-key` | API key for neatlogs distributed tracing. |
| `NEATLOGS_WORKFLOW_NAME` | `prospectforge` | Workflow identifier for neatlogs trace aggregation. |
| `CRUSTDATA_API_KEY` | `demo-crustdata-key` | API key for Crustdata B2B Intelligence REST API. |
| `AWS_BEARER_TOKEN_BEDROCK` | `None` | AWS Bedrock credential token for Claude 3.5 Sonnet. |
| `AWS_REGION` | `us-east-1` | AWS region for Bedrock Converse client. |
| `INJECT_FAULT` | `None` | Fault injection for testing: `empty_search`, `rate_limit`, or `bad_fact`. |

---

## Self-Healing Recovery Demonstration

Judges and evaluators can observe autonomous fault tolerance in real time:

1. **Trigger Condition**: An overly narrow ICP produces zero matching companies from the data provider.
2. **Detection**: `RecoveryController` intercepts the empty response before failing the run.
3. **Adaptive Action Ladder**:
   - Step 1: Expands headcount boundary (e.g., 20–50 → 10–100).
   - Step 2: Relaxes funding stage requirements (Seed → Seed to Series A).
   - Step 3: Re-executes the search query with widened parameters.
4. **Audit Trail**: Emits an explicit recovery event and neatlogs trace span.
5. **UI Visualization**: The dashboard displays the recovery badge (`Recovered after 1 attempt`), detailing the applied adjustments and resulting accounts.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
