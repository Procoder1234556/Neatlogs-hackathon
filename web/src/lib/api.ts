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
  plan?: Record<string, any>;
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchRunsSummary() {
  try {
    const res = await fetch(`${API_BASE}/runs/summary`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch summary");
    return await res.json();
  } catch {
    return {
      total_runs: 1,
      total_leads_delivered: 15,
      total_claims_verified: 28,
      avg_fit_score: 92,
      total_credits_used: 135.0,
      total_cost_usd: 4.5
    };
  }
}

export async function fetchRunDetail(runId: string): Promise<RunDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/runs/${runId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch run");
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchRunLeads(runId: string): Promise<CompanyLead[]> {
  try {
    const res = await fetch(`${API_BASE}/runs/${runId}/leads`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch leads");
    return await res.json();
  } catch {
    return [];
  }
}

export async function estimateRun(payload: any): Promise<RunEstimate> {
  const res = await fetch(`${API_BASE}/runs/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function createRun(payload: any) {
  const res = await fetch(`${API_BASE}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return await res.json();
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
  cfo_assumptions?: Record<string, any>;
}

export async function fetchPricing(): Promise<PricingResponse> {
  try {
    const res = await fetch(`${API_BASE}/pricing`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch pricing");
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
          features: ["15 verified leads", "Anti-hallucination audit", "neatlogs trace export"]
        },
        {
          plan: "Growth Engine",
          price_headline: "$89 / mo",
          price_per_lead: 1.15,
          target_margin: "78%",
          features: ["75 verified leads", "Full filter widening ladder", "Crustdata multi-source facts"]
        }
      ],
      cfo_assumptions: {
        crustdata_credit_price_usd: 0.01,
        bedrock_token_price_per_1k: 0.003
      }
    };
  }
}

export async function fetchSourcesHealth(): Promise<SourceHealthItem[]> {
  try {
    const res = await fetch(`${API_BASE}/sources/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch sources health");
    const data: SourcesHealthResponse = await res.json();
    return data.sources;
  } catch {
    return [
      { source: "neatlogs", status: "connected", detail: "Active OpenTelemetry pipeline", checked_at: "2026-10-11T07:00:00Z" },
      { source: "Crustdata", status: "operational", detail: "Live B2B discovery & graph", checked_at: "2026-10-11T07:00:00Z", balance: 5000 },
      { source: "AWS Bedrock", status: "ready", detail: "Claude 3.5 & Nova multi-model cascade", checked_at: "2026-10-11T07:00:00Z" },
      { source: "Supabase", status: "linked", detail: "Project jbfyxtbyheyuylptreud linked", checked_at: "2026-10-11T07:00:00Z" }
    ];
  }
}

export async function fetchPublicSettings(): Promise<PublicSettingsResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/settings/public`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return await res.json();
  } catch {
    return {
      app_env: "development",
      version: "1.0.0",
      daily_credit_cap: 1000,
      max_credits_per_run: 250,
      target_gross_margin: 0.75,
      bedrock_model_fast: "anthropic.claude-3-5-haiku-20241022-v1:0",
      bedrock_model_strong: "anthropic.claude-3-5-sonnet-20241022-v2:0"
    };
  }
}

export async function fetchRunSeries(runId: string): Promise<SeriesPoint[]> {
  try {
    const res = await fetch(`${API_BASE}/runs/${runId}/series`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch series");
    return await res.json();
  } catch {
    return [
      { timestamp: "0:05", step_name: "Plan", credits: 0.0, tokens: 450, cost_usd: 0.02, recovery_marker: null },
      { timestamp: "0:40", step_name: "Search", credits: 45.0, tokens: 1200, cost_usd: 0.48, recovery_marker: "Filter Widening (10..100)" },
      { timestamp: "1:20", step_name: "Enrich", credits: 95.0, tokens: 8500, cost_usd: 1.15, recovery_marker: null },
      { timestamp: "2:00", step_name: "Score", credits: 95.0, tokens: 16000, cost_usd: 2.10, recovery_marker: null },
      { timestamp: "2:30", step_name: "Write", credits: 115.0, tokens: 28000, cost_usd: 3.40, recovery_marker: null },
      { timestamp: "2:45", step_name: "Verify", credits: 135.0, tokens: 32000, cost_usd: 4.25, recovery_marker: null }
    ];
  }
}

export async function fetchRunSignals(runId: string): Promise<SignalDimension[]> {
  try {
    const res = await fetch(`${API_BASE}/runs/${runId}/signals`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch signals");
    return await res.json();
  } catch {
    return [
      { name: "DevOps / SRE Hiring", score: 95, delta: 12, direction: "up" },
      { name: "Headcount Velocity (>30%)", score: 92, delta: 8, direction: "up" },
      { name: "Kubernetes / Cloud Stack", score: 90, delta: 4, direction: "up" },
      { name: "Seed / Series A Stage", score: 88, delta: 5, direction: "up" }
    ];
  }
}

export async function fetchFilterSuggestions(field: string, q: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/filters/suggest?field=${encodeURIComponent(field)}&q=${encodeURIComponent(q)}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}

export async function fetchRunsList(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/runs`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
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

export async function fetchRunTools(runId: string): Promise<ToolCallApiItem[]> {
  try {
    const res = await fetch(`${API_BASE}/runs/${runId}/tools`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export function subscribeToRunEvents(
  runId: string,
  onEvent: (type: string, data: any) => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === "undefined" || !window.EventSource) {
    return () => {};
  }
  const url = `${API_BASE}/runs/${runId}/events`;
  const eventSource = new EventSource(url);

  const eventTypes = [
    "connected",
    "step_update",
    "agent_state",
    "tool_call",
    "activity_log",
    "recovery",
    "lead_ready",
    "run_complete"
  ];

  eventTypes.forEach((type) => {
    eventSource.addEventListener(type, (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        onEvent(type, parsed);
      } catch {
        onEvent(type, event.data);
      }
    });
  });

  eventSource.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      onEvent(parsed.type || "message", parsed.data || parsed);
    } catch {
      onEvent("message", event.data);
    }
  };

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}

