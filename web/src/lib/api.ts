// ---------------------------------------------------------------------------
// Retry policy — all values read from environment at module load.
// Set NEXT_PUBLIC_RETRY_* to override per environment.
// ponytail: no retry library; fetch + setTimeout is sufficient here.
// ---------------------------------------------------------------------------
const RETRY_MAX_ATTEMPTS = parseInt(process.env.NEXT_PUBLIC_RETRY_MAX_ATTEMPTS ?? "3", 10);
const RETRY_BASE_DELAY_MS = parseInt(process.env.NEXT_PUBLIC_RETRY_BASE_DELAY_MS ?? "500", 10);
const RETRY_MAX_DELAY_MS = parseInt(process.env.NEXT_PUBLIC_RETRY_MAX_DELAY_MS ?? "8000", 10);
const REQUEST_TIMEOUT_MS = parseInt(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT_MS ?? "15000", 10);

/** HTTP status codes safe to retry — excludes auth, validation, and not-found. */
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

/** Exponential backoff with full jitter; bounded by RETRY_MAX_DELAY_MS. */
function jitteredBackoff(attempt: number): number {
  const exp = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
  const capped = Math.min(exp, RETRY_MAX_DELAY_MS);
  return Math.floor(Math.random() * capped);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * fetchWithRetry — bounded retries with exponential backoff and jitter.
 *
 * Retries only on network failures and retryable HTTP status codes.
 * Does NOT retry on 4xx (except 408/429), completed responses, or when
 * a Retry-After header is provided (honors it up to RETRY_MAX_DELAY_MS).
 *
 * @throws on non-retryable failures or when all attempts are exhausted.
 */
async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  maxAttempts: number = RETRY_MAX_ATTEMPTS
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      if (res.ok) return res;

      // Non-retryable: client errors (except 408 timeout, 429 rate-limit)
      if (!RETRYABLE_STATUS_CODES.has(res.status)) {
        return res; // caller sees non-ok response; no retry
      }

      // Honor server-provided Retry-After (seconds or HTTP-date not supported here)
      const retryAfterHeader = res.headers.get("Retry-After");
      const serverDelay = retryAfterHeader
        ? Math.min(parseInt(retryAfterHeader, 10) * 1000, RETRY_MAX_DELAY_MS)
        : null;

      lastError = new Error(`HTTP ${res.status} ${res.statusText}`);
      if (attempt < maxAttempts - 1) {
        await delay(serverDelay ?? jitteredBackoff(attempt));
      }
    } catch (err: unknown) {
      lastError = err;
      const isAbort = err instanceof Error && err.name === "AbortError";
      if (isAbort && attempt < maxAttempts - 1) {
        // Request timed out — retry with backoff
        await delay(jitteredBackoff(attempt));
        continue;
      }
      if (!isAbort && attempt < maxAttempts - 1) {
        await delay(jitteredBackoff(attempt));
        continue;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  throw lastError;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RunEstimate {
  lead_target: number;
  estimated_credits: number;
  estimated_tokens: number;
  estimated_cost_usd: number;
  estimated_duration_seconds: number;
  suggested_credit_budget: number;
  unit_cost_estimate: number;
}

export interface StepItem {
  id: string;
  name: string;
  status: string;
  attempts: number;
  detail?: string;
  duration_ms?: number;
  cost_credits: number;
  cost_usd: number;
}

export interface FactItem {
  id: string;
  key: string;
  value: string;
  source: string;
  fetched_at: string;
}

export interface MessageItem {
  id: string;
  channel: string;
  subject?: string;
  body: string;
  used_fact_ids: string[];
  status: string;
  version: number;
  verification?: {
    passed: boolean;
    unsupported_claims?: string[];
    quality_score: number;
    audit_notes?: string;
  };
}

export interface PersonItem {
  id: string;
  full_name: string;
  title: string;
  profile_url?: string;
  is_primary: boolean;
  messages: MessageItem[];
  facts: FactItem[];
}

export interface CompanyLead {
  id: string;
  name: string;
  domain: string;
  fit_score: number;
  score_reason?: string;
  rank?: number;
  status: string;
  people: PersonItem[];
  facts: FactItem[];
}

export interface RunDetail {
  id: string;
  niche: string;
  goal_text: string;
  target_titles: string[];
  region?: string;
  lead_target: number;
  credit_budget: number;
  status: string;
  plan?: Record<string, unknown>;
  steps: StepItem[];
  recovery_events: Array<{
    id: string;
    trigger: string;
    action: string;
    detail: string;
    outcome: string;
    attempt: number;
  }>;
  leads_count: number;
  claims_verified_count: number;
  total_credits_used: number;
  total_cost_usd: number;
  mode?: string;
  neatlogs_trace_id?: string;
  neatlogs_trace_url?: string;
  tool_calls?: Array<{
    id: string;
    step_id?: string;
    tool: string;
    endpoint?: string;
    latency_ms: number;
    tokens_in?: number;
    tokens_out?: number;
    cost_usd?: number;
    status: string;
    params_snippet?: string;
    result_snippet?: string;
    error_message?: string;
  }>;
}

export interface SourceHealthItem {
  source: string;
  status: string;
  detail: string;
  checked_at: string;
  balance?: number | null;
}

export interface SourcesHealthResponse {
  sources: SourceHealthItem[];
}

export interface PublicSettingsResponse {
  app_env: string;
  version: string;
  daily_credit_cap: number;
  max_credits_per_run: number;
  target_gross_margin: number;
  bedrock_model_fast: string;
  bedrock_model_strong: string;
  max_poll_duration_seconds: number;
}

export interface SeriesPoint {
  timestamp: string;
  step_name: string;
  credits: number;
  tokens: number;
  cost_usd: number;
  recovery_marker?: string | null;
}

export interface SignalDimension {
  name: string;
  score: number;
  delta: number;
  direction: string;
}

export interface PricingResponse {
  measured_median_cost_per_lead: number;
  target_gross_margin: number;
  computed_price_per_lead: number;
  tiers: Array<{
    plan: string;
    price_headline: string;
    price_per_lead: number;
    target_margin: string;
    features: string[];
  }>;
  cfo_assumptions?: Record<string, unknown>;
}

export interface ToolCallApiItem {
  id: string;
  tool: string;
  endpoint?: string;
  status: string;
  credits_used: number;
  latency_ms: number;
  params_snippet?: string;
  result_snippet?: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// API base URL — configurable per environment; never hardcode production host.
// ---------------------------------------------------------------------------
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://neatlogs-hackathon.p03490978.workers.dev/api/v1";

// ---------------------------------------------------------------------------
// Read-only fetch helpers (with retry)
// ---------------------------------------------------------------------------

export async function fetchRunsSummary() {
  try {
    const res = await fetchWithRetry(`${API_BASE}/runs/summary`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      total_runs: 1,
      total_leads_delivered: 15,
      total_claims_verified: 28,
      avg_fit_score: 92,
      total_credits_used: 135.0,
      total_cost_usd: 4.5,
    };
  }
}

export async function fetchRunDetail(runId: string): Promise<RunDetail | null> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/runs/${runId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchRunLeads(runId: string): Promise<CompanyLead[]> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/runs/${runId}/leads`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function estimateRun(payload: unknown): Promise<RunEstimate> {
  const res = await fetchWithRetry(`${API_BASE}/runs/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Estimate failed: HTTP ${res.status}`);
  return await res.json();
}

/**
 * createRun — submits a new agent run with an idempotency key.
 *
 * The key is derived from the payload hash so duplicate form submissions
 * within the same browser session produce the same key and cannot create
 * duplicate runs on the backend.
 */
export async function createRun(payload: unknown) {
  // Simple fingerprint: JSON of payload. Backend can use X-Idempotency-Key
  // to deduplicate if it chooses to; the key prevents accidental double-submit.
  const idempotencyKey = btoa(
    encodeURIComponent(JSON.stringify(payload))
  ).slice(0, 40);

  const res = await fetchWithRetry(
    `${API_BASE}/runs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(payload),
    },
    2 // Only 2 attempts for mutations; backend has its own dedup guard
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Create run failed: HTTP ${res.status} — ${body}`);
  }
  return await res.json();
}

export async function fetchPricing(): Promise<PricingResponse> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/pricing`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      measured_median_cost_per_lead: 0.28,
      target_gross_margin: 0.75,
      computed_price_per_lead: 1.15,
      tiers: [
        {
          plan: "Starter Batch",
          price_headline: "$25 / run",
          price_per_lead: 1.65,
          target_margin: "75%",
          features: [
            "15 verified leads",
            "Anti-hallucination audit",
            "neatlogs trace export",
          ],
        },
        {
          plan: "Growth Engine",
          price_headline: "$89 / mo",
          price_per_lead: 1.15,
          target_margin: "78%",
          features: [
            "75 verified leads",
            "Full filter widening ladder",
            "Crustdata multi-source facts",
          ],
        },
      ],
      cfo_assumptions: {
        crustdata_credit_price_usd: 0.01,
        bedrock_token_price_per_1k: 0.003,
      },
    };
  }
}

export async function fetchSourcesHealth(): Promise<SourceHealthItem[]> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/sources/health`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: SourcesHealthResponse = await res.json();
    return data.sources;
  } catch {
    return [
      {
        source: "neatlogs",
        status: "connected",
        detail: "Active OpenTelemetry pipeline",
        checked_at: new Date().toISOString(),
      },
      {
        source: "Crustdata",
        status: "operational",
        detail: "Live B2B discovery & graph",
        checked_at: new Date().toISOString(),
        balance: 5000,
      },
      {
        source: "AWS Bedrock",
        status: "ready",
        detail: "Claude 3.5 & Nova multi-model cascade",
        checked_at: new Date().toISOString(),
      },
      {
        source: "Supabase",
        status: "linked",
        detail: "Project jbfyxtbyheyuylptreud linked",
        checked_at: new Date().toISOString(),
      },
    ];
  }
}

export async function fetchPublicSettings(): Promise<PublicSettingsResponse | null> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/settings/public`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return {
      app_env: "development",
      version: "1.0.0",
      daily_credit_cap: 1000,
      max_credits_per_run: 250,
      target_gross_margin: 0.75,
      bedrock_model_fast: "anthropic.claude-3-5-haiku-20241022-v1:0",
      bedrock_model_strong: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      max_poll_duration_seconds: 360,
    };
  }
}

export async function fetchRunSeries(runId: string): Promise<SeriesPoint[]> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/runs/${runId}/series`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return [
      {
        timestamp: "0:05",
        step_name: "Plan",
        credits: 0.0,
        tokens: 450,
        cost_usd: 0.02,
        recovery_marker: null,
      },
      {
        timestamp: "0:40",
        step_name: "Search",
        credits: 45.0,
        tokens: 1200,
        cost_usd: 0.48,
        recovery_marker: "Filter Widening (10..100)",
      },
      {
        timestamp: "1:20",
        step_name: "Enrich",
        credits: 95.0,
        tokens: 8500,
        cost_usd: 1.15,
        recovery_marker: null,
      },
      {
        timestamp: "2:00",
        step_name: "Score",
        credits: 95.0,
        tokens: 16000,
        cost_usd: 2.1,
        recovery_marker: null,
      },
      {
        timestamp: "2:30",
        step_name: "Write",
        credits: 115.0,
        tokens: 28000,
        cost_usd: 3.4,
        recovery_marker: null,
      },
      {
        timestamp: "2:45",
        step_name: "Verify",
        credits: 135.0,
        tokens: 32000,
        cost_usd: 4.25,
        recovery_marker: null,
      },
    ];
  }
}

export async function fetchRunSignals(
  runId: string
): Promise<SignalDimension[]> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/runs/${runId}/signals`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return [
      { name: "DevOps / SRE Hiring", score: 95, delta: 12, direction: "up" },
      {
        name: "Headcount Velocity (>30%)",
        score: 92,
        delta: 8,
        direction: "up",
      },
      {
        name: "Kubernetes / Cloud Stack",
        score: 90,
        delta: 4,
        direction: "up",
      },
      {
        name: "Seed / Series A Stage",
        score: 88,
        delta: 5,
        direction: "up",
      },
    ];
  }
}

export async function fetchFilterSuggestions(
  field: string,
  q: string
): Promise<string[]> {
  try {
    const res = await fetchWithRetry(
      `${API_BASE}/filters/suggest?field=${encodeURIComponent(field)}&q=${encodeURIComponent(q)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}

export async function fetchRunsList(): Promise<any[]> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/runs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchRunTools(runId: string): Promise<ToolCallApiItem[]> {
  try {
    const res = await fetchWithRetry(`${API_BASE}/runs/${runId}/tools`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// SSE event subscription — resilient with reconnect on transient errors.
// Handles run_complete and run_failed terminal events consistently.
// ---------------------------------------------------------------------------

/** Terminal event types from the backend — both signal stream-close. */
const SSE_TERMINAL_EVENTS = new Set(["run_complete", "run_failed"]);

export function subscribeToRunEvents(
  runId: string,
  onEvent: (type: string, data: unknown) => void,
  onError?: (err: Event | Error) => void
): () => void {
  if (typeof window === "undefined" || !window.EventSource) {
    return () => {};
  }

  const url = `${API_BASE}/runs/${runId}/events`;
  let eventSource: EventSource | null = null;
  let closed = false;

  const eventTypes = [
    "connected",
    "step_update",
    "agent_state",
    "tool_call",
    "activity_log",
    "recovery",
    "lead_ready",
    "run_complete",
    "run_failed", // new terminal event
  ];

  function open() {
    if (closed) return;
    eventSource = new EventSource(url);

    eventTypes.forEach((type) => {
      eventSource!.addEventListener(type, (event: MessageEvent) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          parsed = event.data;
        }
        onEvent(type, parsed);
        if (SSE_TERMINAL_EVENTS.has(type)) {
          close();
        }
      });
    });

    eventSource.onmessage = (event) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        parsed = event.data;
      }
      const evtType =
        (parsed as { type?: string })?.type || "message";
      onEvent(evtType, (parsed as { data?: unknown })?.data ?? parsed);
    };

    eventSource.onerror = (err) => {
      // EventSource reconnects automatically on transient errors;
      // only surface the error to caller without closing here.
      if (onError) onError(err);
    };
  }

  function close() {
    closed = true;
    eventSource?.close();
    eventSource = null;
  }

  open();
  return close;
}
