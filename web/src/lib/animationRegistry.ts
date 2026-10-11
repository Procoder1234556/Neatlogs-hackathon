// ponytail: centralized animation tokens and single-active-animation invariant
// maps agent lifecycle states to Beautiful UI animation behaviors with reduced-motion compliance

export type AgentLifecycleState =
  | "idle"
  | "request_received"
  | "thinking"
  | "planning"
  | "tool_execution"
  | "waiting"
  | "evaluating"
  | "completed"
  | "failed";

export type AgentRole = "Planner" | "Researcher" | "Enricher" | "Scorer" | "Writer" | "Verifier" | "RecoveryEngine" | "Orchestrator";

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  agent: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

export interface ToolExecutionItem {
  id: string;
  toolName: string;
  durationMs?: number;
  status: "running" | "success" | "recovered" | "error";
  paramsSnippet?: string;
  resultSnippet?: string;
  timestamp?: string;
}

export interface AnimationSpec {
  state: AgentLifecycleState;
  label: string;
  description: string;
  cssClass: string;
  badgeColor: string;
  pulseActive: boolean;
  reducedMotionClass: string;
}

export const ANIMATION_REGISTRY: Record<AgentLifecycleState, AnimationSpec> = {
  idle: {
    state: "idle",
    label: "Idle & Ready",
    description: "System waiting for next user instruction",
    cssClass: "opacity-80 transition-opacity duration-300",
    badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
    pulseActive: false,
    reducedMotionClass: "opacity-80"
  },
  request_received: {
    state: "request_received",
    label: "Request Accepted",
    description: "Parsing parameters & compiling initial execution context",
    cssClass: "animate-morph duration-200",
    badgeColor: "bg-blue-950/80 text-blue-300 border-blue-800",
    pulseActive: true,
    reducedMotionClass: "opacity-100"
  },
  thinking: {
    state: "thinking",
    label: "Reasoning & Pipeline Formulation",
    description: "Synthesizing strategy via Claude 3.5 / Nova multi-model cascade",
    cssClass: "animate-shimmer",
    badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-800",
    pulseActive: true,
    reducedMotionClass: "border-indigo-500"
  },
  planning: {
    state: "planning",
    label: "Compiling Search Ladder",
    description: "Structuring primary and fallback filter parameters",
    cssClass: "animate-pulse",
    badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-800",
    pulseActive: true,
    reducedMotionClass: "border-cyan-500"
  },
  tool_execution: {
    state: "tool_execution",
    label: "Autonomous Tool In Flight",
    description: "Executing live upstream API call with latency & credit metering",
    cssClass: "ring-2 ring-blue-500/60 shadow-lg shadow-blue-500/10",
    badgeColor: "bg-blue-900/80 text-blue-200 border-blue-600",
    pulseActive: true,
    reducedMotionClass: "border-blue-500 ring-0"
  },
  waiting: {
    state: "waiting",
    label: "Waiting for API Telemetry",
    description: "Awaiting upstream network response without artificial progress",
    cssClass: "opacity-90",
    badgeColor: "bg-amber-950/80 text-amber-300 border-amber-800",
    pulseActive: false,
    reducedMotionClass: "opacity-90"
  },
  evaluating: {
    state: "evaluating",
    label: "Scoring & Guardrail Audit",
    description: "Auditing factual claims against stored ground-truth facts",
    cssClass: "ring-1 ring-purple-500/50",
    badgeColor: "bg-purple-950/80 text-purple-300 border-purple-800",
    pulseActive: true,
    reducedMotionClass: "border-purple-500"
  },
  completed: {
    state: "completed",
    label: "Run Complete",
    description: "All steps verified and leads delivered within budget",
    cssClass: "animate-morph",
    badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
    pulseActive: false,
    reducedMotionClass: "border-emerald-600"
  },
  failed: {
    state: "failed",
    label: "Execution Failed",
    description: "Operation halted with error details preserved",
    cssClass: "ring-2 ring-rose-500/70",
    badgeColor: "bg-rose-950/80 text-rose-300 border-rose-800",
    pulseActive: false,
    reducedMotionClass: "border-rose-600 ring-0"
  }
};
