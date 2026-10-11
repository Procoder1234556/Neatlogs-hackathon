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
  neatlogs_trace_id?: string;
  neatlogs_trace_url?: string;
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

export async function fetchPricing() {
  try {
    const res = await fetch(`${API_BASE}/pricing`, { cache: "no-store" });
    return await res.json();
  } catch {
    return {
      measured_median_cost_per_lead: 0.28,
      target_gross_margin: 0.75,
      computed_price_per_lead: 1.15,
      tiers: []
    };
  }
}
