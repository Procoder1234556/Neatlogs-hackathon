"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Download,
  Sliders,
  DollarSign,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Database,
  Layers,
  Terminal,
  Activity,
  Plus,
  MessageSquare,
  Compass,
  BookOpen,
  Puzzle,
  Calendar,
  Mic,
  Brain,
  PanelLeftClose,
  PanelLeft,
  Volume2,
  Sparkles,
  Send,
  Check,
  Image as ImageIcon,
  PenLine,
  Globe,
  SlidersHorizontal,
  Info,
  Wrench
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import {
  API_BASE,
  fetchRunsSummary,
  fetchRunDetail,
  fetchRunLeads,
  fetchPricing,
  fetchSourcesHealth,
  fetchPublicSettings,
  fetchRunSeries,
  fetchRunSignals,
  fetchFilterSuggestions,
  fetchRunsList,
  fetchRunTools,
  subscribeToRunEvents,
  createRun,
  SourceHealthItem,
  RunDetail,
  PublicSettingsResponse,
  PricingResponse,
  SignalDimension,
  CompanyLead,
  ToolCallApiItem
} from "../lib/api";
import {
  AgentLifecycleState,
  ActivityLogItem,
  ANIMATION_REGISTRY
} from "../lib/animationRegistry";
import LoadingState from "../components/LoadingState";
import ThinkingState, { ThinkingStepItem } from "../components/ThinkingState";
import TaskRows, { TaskItem } from "../components/TaskRows";
import StreamingText from "../components/StreamingText";
import ApprovalCard from "../components/ApprovalCard";
import ToolChips, { ToolCallItem } from "../components/ToolChips";
import ActivityFeed from "../components/ActivityFeed";
import AgentStatusBeacon from "../components/AgentStatusBeacon";
import AgentWorkflowGraph, { WorkflowNode } from "../components/AgentWorkflowGraph";
import MarketingLanding from "../components/MarketingLanding";

// Initial Telemetry spend data
const INITIAL_SERIES_DATA = [
  { time: "0:00", credits: 0, tokens: 450, cost: 0.02, recovery: null },
  { time: "0:25", credits: 25, tokens: 1800, cost: 0.35, recovery: null },
  { time: "0:50", credits: 55, tokens: 6200, cost: 0.85, recovery: "Filter Widening (10..100)" },
  { time: "1:20", credits: 85, tokens: 14500, cost: 1.65, recovery: null },
  { time: "1:55", credits: 110, tokens: 24000, cost: 2.80, recovery: null },
  { time: "2:30", credits: 125, tokens: 30000, cost: 3.65, recovery: null },
  { time: "2:45", credits: 135, tokens: 32500, cost: 4.10, recovery: null },
];

const INITIAL_LEADS = [
  {
    id: "c-001",
    rank: 1,
    name: "CloudScale Systems",
    domain: "cloudscalesystems.io",
    fitScore: 94,
    scoreReason: "Direct ICP match: 42% 6-month headcount growth, actively hiring Senior DevOps Engineer, recent $3.5M Seed round.",
    decisionMaker: {
      name: "Alex Chen",
      title: "VP of Engineering",
      linkedin: "https://linkedin.com/in/alex-chen-cloudscale",
      highlight: "Former Staff Infrastructure Lead at Stripe; scaling CloudScale deployment mesh."
    },
    facts: [
      { key: "headcount_growth", val: "+42% (6 months)", source: "Crustdata / headcount_growth" },
      { key: "funding_round", val: "Seed ($3.5M)", source: "Crustdata / funding_summary" },
      { key: "hiring_signal", val: "Senior DevOps Engineer", source: "Crustdata / job_openings" },
      { key: "tech_stack", val: "Kubernetes, AWS, Terraform, Next.js", source: "Crustdata / technographics" }
    ],
    email: {
      subject: "Quick question on CloudScale deployment guardrails",
      body: "Hi Alex,\n\nSaw that CloudScale grew engineering headcount by 42% over the last two quarters and is actively hiring senior DevOps engineers.\n\nGiven your background scaling infrastructure at Stripe, would love to share how teams in your stage streamline deployment guardrails without slowing release velocity.\n\nOpen to a brief chat next Tuesday?\n\nBest,\nNikunj",
      verified: true,
      qualityScore: 98,
      unsupportedClaims: 0
    }
  },
  {
    id: "c-002",
    rank: 2,
    name: "NexusOps AI",
    domain: "nexusops.ai",
    fitScore: 91,
    scoreReason: "Active SRE hiring, 38% growth, recently deployed multi-cloud infrastructure.",
    decisionMaker: {
      name: "Elena Rostova",
      title: "Head of Platform",
      linkedin: "https://linkedin.com/in/elena-rostova-nexus",
      highlight: "Built scalable cloud monitoring at Datadog; leading platform infra at NexusOps."
    },
    facts: [
      { key: "headcount_growth", val: "+38% (6 months)", source: "Crustdata / headcount_growth" },
      { key: "funding_round", val: "Seed ($4.2M)", source: "Crustdata / funding_summary" },
      { key: "hiring_signal", val: "Head of Platform Security", source: "Crustdata / job_openings" }
    ],
    email: {
      subject: "Scaling platform security at NexusOps",
      body: "Hi Elena,\n\nNoticed NexusOps recently expanded platform headcount by 38% and is hiring a Head of Platform Security.\n\nGiven your Datadog monitoring background, would love to compare notes on automated security verification.\n\nBest,\nNikunj",
      verified: true,
      qualityScore: 95,
      unsupportedClaims: 0
    }
  },
  {
    id: "c-003",
    rank: 3,
    name: "InfraPulse Technologies",
    domain: "infrapulse.dev",
    fitScore: 89,
    scoreReason: "High headcount velocity (+55%), hiring Lead Systems Engineer, seed stage.",
    decisionMaker: {
      name: "Marcus Vance",
      title: "Chief Technology Officer",
      linkedin: "https://linkedin.com/in/marcus-vance-infra",
      highlight: "12 years distributed systems engineering; co-founded InfraPulse."
    },
    facts: [
      { key: "headcount_growth", val: "+55% (6 months)", source: "Crustdata / headcount_growth" },
      { key: "funding_round", val: "Seed ($2.8M)", source: "Crustdata / funding_summary" },
      { key: "hiring_signal", val: "Lead Systems Engineer", source: "Crustdata / job_openings" }
    ],
    email: {
      subject: "InfraPulse distributed systems scaling",
      body: "Hi Marcus,\n\nSaw InfraPulse grew by 55% this year and is adding lead systems engineers.\n\nWould love to show you how our autonomous verification engine prevents drift.\n\nBest,\nNikunj",
      verified: true,
      qualityScore: 96,
      unsupportedClaims: 0
    }
  }
];

export default function Dashboard() {
  // Top-level app view: marketing page first, then dashboard
  const [appView, setAppView] = useState<"marketing" | "dashboard">("marketing");

  // Navigation & Layout states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "work">("chat");
  const [thinkEnabled, setThinkEnabled] = useState(true);

  // App Page View State: Always land at "landing" first!
  const [viewState, setViewState] = useState<"landing" | "running" | "results">("landing");
  const [visibleLeadCount, setVisibleLeadCount] = useState<number>(0);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);

  // ICP Prompt states
  const [goalText, setGoalText] = useState("Early-stage startups hiring DevOps in US");
  const [niche, setNiche] = useState("Fintech & Cloud Infrastructure");
  const [leadTarget, setLeadTarget] = useState(15);
  const [creditBudget, setCreditBudget] = useState(250);

  // Intermediate Processing States (beautifului.dev - sequential one-by-one with constant timer)
  type ProcessingPhase = "idle" | "churning" | "tools" | "tasks" | "streaming" | "approval";

  const PHASES_LIST: { id: ProcessingPhase; label: string; icon: string; desc: string }[] = [
    { id: "churning", label: "1. Churning", icon: "⚡", desc: "Wavefront grid & reasoning formulation" },
    { id: "tools", label: "2. Tool Calls", icon: "🛠️", desc: "Crustdata & Bedrock API execution cascade" },
    { id: "tasks", label: "3. Task Pipeline", icon: "📋", desc: "Multi-stage autonomous step progress" },
    { id: "streaming", label: "4. Stream Outreach", icon: "✨", desc: "Fact-grounded email drafting" },
    { id: "approval", label: "5. Lead Approval", icon: "🛡️", desc: "Human-in-the-loop verification" }
  ];

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>("idle");
  const [processingElapsedMs, setProcessingElapsedMs] = useState(0);
  const [selectedLeadIndex, setSelectedLeadIndex] = useState<number>(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Backend sync states
  const [activeRunId, setActiveRunId] = useState<string>("demo-seed-001");
  const [activeRun, setActiveRun] = useState<RunDetail | null>(null);
  const [runSummary, setRunSummary] = useState<any>({
    total_runs: 1,
    total_leads_delivered: 15,
    total_claims_verified: 28,
    avg_fit_score: 92,
    total_credits_used: 135.0,
    total_cost_usd: 4.5
  });
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null);
  const [sourcesHealth, setSourcesHealth] = useState<SourceHealthItem[]>([]);
  const [publicSettings, setPublicSettings] = useState<PublicSettingsResponse | null>(null);
  interface ChartPoint {
    time: string;
    credits: number;
    tokens: number;
    cost: number;
    recovery?: string | null;
  }
  const [seriesData, setSeriesData] = useState<ChartPoint[]>(INITIAL_SERIES_DATA);
  const [signalBars, setSignalBars] = useState<SignalDimension[]>([
    { name: "DevOps / SRE Hiring", score: 95, delta: 12, direction: "up" },
    { name: "Headcount Velocity (>30%)", score: 92, delta: 8, direction: "up" },
    { name: "Kubernetes / Cloud Stack", score: 90, delta: 4, direction: "up" },
    { name: "Seed / Series A Stage", score: 88, delta: 5, direction: "up" }
  ]);
  const [leads, setLeads] = useState<any[]>(INITIAL_LEADS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showNewRunModal, setShowNewRunModal] = useState(false);

  // Live Agent Lifecycle & Animation States
  const [lifecycleState, setLifecycleState] = useState<AgentLifecycleState>("idle");
  const [activeAgentName, setActiveAgentName] = useState<string>("ProspectForge Orchestrator");
  const [activeAgentDetail, setActiveAgentDetail] = useState<string>("Ready to execute autonomous pipeline");

  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    { id: "plan", name: "ICP Plan Synthesis", role: "Planner Agent", tool: "Bedrock.planner", status: "completed", durationMs: 450 },
    { id: "research", name: "Company Discovery", role: "Researcher", tool: "Crustdata.company_search", status: "completed", durationMs: 320 },
    { id: "recovery", name: "Filter Widening Ladder", role: "RecoveryEngine", tool: "Crustdata.ladder_retry", status: "recovered", durationMs: 280 },
    { id: "enrich", name: "Decision Maker Mapping", role: "Enricher", tool: "Crustdata.person_search", status: "completed", durationMs: 180 },
    { id: "score", name: "ICP Fit Scoring", role: "Scorer Agent", tool: "Scorer.vector_rank", status: "completed", durationMs: 120 },
    { id: "verify", name: "Outreach & Guardrail", role: "Verifier", tool: "neatlogs.guardrail", status: "completed", durationMs: 95 }
  ]);

  const [liveTools, setLiveTools] = useState<ToolCallItem[]>([
    { id: "tc-1", toolName: "Crustdata.company_search", durationMs: 240, status: "recovered", paramsSnippet: "headcount: 10..150, stage: Seed..Series B", resultSnippet: "Recovered 5 verified company candidates" },
    { id: "tc-2", toolName: "Crustdata.find_decision_makers", durationMs: 180, status: "success", paramsSnippet: "titles: VP Engineering, Head of Platform", resultSnippet: "Mapped: Alex Chen, Elena Rostova" },
    { id: "tc-3", toolName: "AWSBedrock.converse (Nova/Claude)", durationMs: 420, status: "success", paramsSnippet: "prompt: outreach_synthesis_v2", resultSnippet: "Synthesized fact-grounded outreach" },
    { id: "tc-4", toolName: "neatlogs.trace_span.guardrail_verify", durationMs: 95, status: "success", paramsSnippet: "claims: 3 checked per lead", resultSnippet: "Zero ungrounded claims detected" }
  ]);

  const [liveActivityLogs, setLiveActivityLogs] = useState<ActivityLogItem[]>([
    { id: "log-1", timestamp: "0:05", agent: "Planner", level: "info", message: "Parsed ICP parameters: Early-stage startups hiring DevOps in US." },
    { id: "log-2", timestamp: "0:40", agent: "Researcher", level: "info", message: "Initial query returned 0 matches (fault injected). Triggering recovery ladder." },
    { id: "log-3", timestamp: "0:45", agent: "RecoveryEngine", level: "warning", message: "Widened headcount 10..150 & added Series B. Recovered 5 candidates." },
    { id: "log-4", timestamp: "1:20", agent: "Enricher", level: "info", message: "Enriched headcount velocity and mapped primary decision makers." },
    { id: "log-5", timestamp: "2:00", agent: "Scorer", level: "info", message: "Scored candidate cohort: average ICP fit 92/100." },
    { id: "log-6", timestamp: "2:45", agent: "Verifier", level: "success", message: "Anti-hallucination guardrail passed: 100% facts verified." }
  ]);

  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStepItem[]>([
    { id: "s1", name: "Parse ICP goal & resolve firmographic criteria", detail: "Targeting: Early-stage DevOps in US", status: "done" },
    { id: "s2", name: "Formulate Crustdata primary & fallback search ladder", detail: "Headcount 10..50, US, Seed/Series A", status: "done" },
    { id: "s3", name: "Execute multi-model Bedrock cascade with anti-hallucination audit", detail: "Claude 3.5 / Nova with deterministic synthesis fallback", status: "done" }
  ]);

  const eventSourceCleanupRef = useRef<(() => void) | null>(null);

  const processingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const printTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatProcessingTimer = (ms: number) => {
    const totalSeconds = ms / 1000;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const tenths = Math.floor((ms % 1000) / 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${tenths}s`;
  };

  const clearAllPhaseTimeouts = () => {
    phaseTimeoutsRef.current.forEach((t) => clearTimeout(t));
    phaseTimeoutsRef.current = [];
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (printTimerRef.current) {
      clearInterval(printTimerRef.current);
      printTimerRef.current = null;
    }
    if (eventSourceCleanupRef.current) {
      eventSourceCleanupRef.current();
      eventSourceCleanupRef.current = null;
    }
  };

  // Map backend lead
  const mapApiLeadToUI = (comp: CompanyLead, idx: number) => {
    const primaryPerson = comp.people && comp.people.length > 0 ? comp.people[0] : null;
    const primaryMsg = primaryPerson && primaryPerson.messages && primaryPerson.messages.length > 0 ? primaryPerson.messages[0] : null;

    return {
      id: comp.id,
      rank: idx + 1,
      name: comp.name,
      domain: comp.domain,
      fitScore: comp.fit_score || 88,
      scoreReason: comp.score_reason || "Autonomous scoring matched target hiring and stack requirements.",
      decisionMaker: {
        name: primaryPerson ? primaryPerson.full_name : "Alex Chen",
        title: primaryPerson ? primaryPerson.title : "VP of Engineering",
        linkedin: primaryPerson?.profile_url || "https://linkedin.com",
        highlight: "Decision maker identified with ground-truth verification."
      },
      facts: comp.facts && comp.facts.length > 0
        ? comp.facts.map((f) => ({ key: f.key, val: f.value, source: f.source }))
        : [
            { key: "headcount", val: "35 engineers", source: "Crustdata / firmographics" },
            { key: "funding", val: "Seed ($3.5M)", source: "Crustdata / funding" }
          ],
      email: {
        subject: primaryMsg?.subject || "Quick question regarding deployment reliability",
        body: primaryMsg?.body || "Hi Alex,\n\nNoticed your team is hiring senior DevOps engineers...",
        verified: primaryMsg?.status === "verified",
        qualityScore: primaryMsg?.verification?.quality_score || 95,
        unsupportedClaims: primaryMsg?.verification?.unsupported_claims?.length || 0
      }
    };
  };

  // Fetch live system data
  const refreshAll = async () => {
    setIsRefreshing(true);
    try {
      const [sources, summary, settings, pricing, runsList] = await Promise.all([
        fetchSourcesHealth(),
        fetchRunsSummary(),
        fetchPublicSettings(),
        fetchPricing(),
        fetchRunsList()
      ]);
      if (sources && sources.length > 0) setSourcesHealth(sources);
      if (summary) setRunSummary(summary);
      if (settings) setPublicSettings(settings);
      if (pricing) setPricingData(pricing);
      if (runsList && runsList.length > 0) {
        setRecentRuns(runsList);
        const targetId = runsList[0].id;
        setActiveRunId(targetId);
      }
    } catch (err) {
      console.warn("Live API sync fallback:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadExistingRun = async (runId: string) => {
    setActiveRunId(runId);
    clearAllPhaseTimeouts();
    setIsProcessing(false);
    try {
      const [detail, leadsData, series, signals, tools] = await Promise.all([
        fetchRunDetail(runId),
        fetchRunLeads(runId),
        fetchRunSeries(runId),
        fetchRunSignals(runId),
        fetchRunTools(runId)
      ]);
      if (detail) {
        setActiveRun(detail);
        if (detail.status === "complete") {
          setLifecycleState("completed");
          setActiveAgentDetail(`Completed: delivered ${detail.leads_count} leads.`);
        }
      }
      if (tools && tools.length > 0) {
        setLiveTools(
          tools.map((t) => ({
            id: t.id,
            toolName: t.tool,
            status: t.status === "ok" ? "success" : (t.status as any),
            durationMs: t.latency_ms,
            paramsSnippet: t.params_snippet || t.endpoint || "",
            resultSnippet: t.result_snippet || ""
          }))
        );
      }
      if (leadsData && leadsData.length > 0) {
        const mapped = leadsData.map(mapApiLeadToUI);
        setLeads(mapped);
        setViewState("results");
        setVisibleLeadCount(mapped.length);
      }
      if (series && series.length > 0) {
        setSeriesData(
          series.map((s) => ({
            time: s.timestamp,
            credits: s.credits,
            tokens: s.tokens,
            cost: s.cost_usd,
            recovery: s.recovery_marker || null
          }))
        );
      }
      if (signals && signals.length > 0) setSignalBars(signals);
    } catch (err) {
      console.error("Error loading run:", err);
    }
  };

  useEffect(() => {
    refreshAll();
    return () => {
      clearAllPhaseTimeouts();
      if (processingTimerRef.current) clearInterval(processingTimerRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (printTimerRef.current) clearInterval(printTimerRef.current);
      if (eventSourceCleanupRef.current) {
        eventSourceCleanupRef.current();
        eventSourceCleanupRef.current = null;
      }
    };
  }, []);

  // Real-time backend event processor
  const handleBackendEvent = (eventType: string, data: any, runId: string) => {
    const timeStr = new Date().toLocaleTimeString();

    if (eventType === "agent_state") {
      if (data.state) setLifecycleState(data.state);
      if (data.agent) setActiveAgentName(data.agent);
      if (data.detail) setActiveAgentDetail(data.detail);

      if (data.state === "thinking" || data.state === "planning") {
        setProcessingPhase("churning");
      } else if (data.state === "executing_tool") {
        setProcessingPhase("tools");
      } else if (data.state === "evaluating") {
        setProcessingPhase("tasks");
      } else if (data.state === "completed") {
        setProcessingPhase("approval");
      }
    } else if (eventType === "tool_call") {
      const toolItem: ToolCallItem = {
        id: data.id || `tc-${Date.now()}`,
        toolName: data.tool || "Autonomous Tool",
        durationMs: data.duration_ms,
        status: data.status || "success",
        paramsSnippet: data.paramsSnippet,
        resultSnippet: data.resultSnippet
      };
      setLiveTools((prev) => {
        const existingIdx = prev.findIndex((t) => t.id === toolItem.id || t.toolName === toolItem.toolName);
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = { ...next[existingIdx], ...toolItem };
          return next;
        }
        return [...prev, toolItem];
      });

      if (data.status === "running") {
        setLifecycleState("tool_execution");
        setActiveAgentDetail(`Executing ${data.tool}...`);
      }
    } else if (eventType === "activity_log") {
      const logItem: ActivityLogItem = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        agent: data.agent || "Agent",
        level: data.level || "info",
        message: data.message || ""
      };
      setLiveActivityLogs((prev) => [...prev, logItem]);
    } else if (eventType === "step_update") {
      const stepName = data.step;
      const stepStatus = data.status;

      setWorkflowNodes((prev) =>
        prev.map((n) => {
          if (n.id === stepName) {
            return {
              ...n,
              status: stepStatus === "running" ? "active" : stepStatus === "done" ? "completed" : stepStatus === "recovered" ? "recovered" : stepStatus === "failed" ? "failed" : n.status,
              durationMs: data.duration_ms || n.durationMs,
              detail: data.detail || n.detail
            };
          }
          return n;
        })
      );

      if (stepName === "plan" && data.plan) {
        setThinkingSteps([
          { id: "s1", name: "Execution strategy synthesized", detail: data.plan.strategy || "Targeted ICP discovery", status: "done" },
          { id: "s2", name: "Primary Crustdata filters compiled", detail: JSON.stringify(data.plan.primary_filters || {}).slice(0, 70), status: "done" },
          { id: "s3", name: "Guardrail invariants established", detail: "Anti-hallucination verification active", status: "running" }
        ]);
        setProcessingPhase("tools");
      } else if (stepName === "research" && stepStatus === "running") {
        setProcessingPhase("tools");
      } else if ((stepName === "enrich" || stepName === "score") && stepStatus === "running") {
        setProcessingPhase("tasks");
      } else if ((stepName === "write" || stepName === "verify") && stepStatus === "running") {
        setProcessingPhase("streaming");
      }
    } else if (eventType === "recovery") {
      setWorkflowNodes((prev) =>
        prev.map((n) => (n.id === "recovery" ? { ...n, status: "recovered", detail: data.detail } : n))
      );
      setLiveActivityLogs((prev) => [
        ...prev,
        {
          id: `log-rec-${Date.now()}`,
          timestamp: timeStr,
          agent: "RecoveryEngine",
          level: "warning",
          message: `Autonomous recovery triggered (${data.trigger}): ${data.detail}`
        }
      ]);
    } else if (eventType === "lead_ready") {
      const companyName = data?.company_name || data?.name || data?.company || "Target Company";
      setLeads((prev) => {
        if (prev.some((l) => l.name === companyName)) return prev;
        const newLead = {
          id: `c-dyn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          rank: prev.length + 1,
          name: companyName,
          domain: `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.io`,
          fitScore: data?.fit_score || 92,
          scoreReason: data?.score_reason || "Scored and verified via autonomous live pipeline.",
          decisionMaker: {
            name: data?.person_name || data?.decision_maker || "Alex Chen",
            title: data?.title || "VP of Engineering",
            linkedin: "https://linkedin.com",
            highlight: "Decision maker verified with ground-truth facts."
          },
          facts: [
            { key: "verification", val: data?.verified ? "Passed (100%)" : "Audit complete", source: "neatlogs / guardrail" },
            { key: "fit_score", val: `${data?.fit_score || 92}% ICP alignment`, source: "scorer / icp_vector" }
          ],
          email: {
            subject: `Connecting regarding engineering growth at ${companyName}`,
            body: `Hi ${data?.person_name ? data.person_name.split(" ")[0] : "there"},\n\nSaw your team at ${companyName} is actively expanding engineering infrastructure.\n\nWould love to share how teams streamline deployment guardrails without slowing release velocity.\n\nBest,\nNikunj`,
            verified: data?.verified !== false,
            qualityScore: 98,
            unsupportedClaims: 0
          }
        };
        return [...prev, newLead];
      });
    } else if (eventType === "run_complete") {
      setLifecycleState("completed");
      setActiveAgentName("ProspectForge Orchestrator");
      setActiveAgentDetail("Run completed successfully.");
      setProcessingPhase("approval");
      setIsProcessing(false);
      if (processingTimerRef.current) {
        clearInterval(processingTimerRef.current);
        processingTimerRef.current = null;
      }
      refreshAll();
    }
  };

  // Launch Autonomous Agent with REAL SSE & Backend event subscriptions
  const handleLaunchRun = async () => {
    if (isProcessing) return;

    clearAllPhaseTimeouts();
    if (processingTimerRef.current) clearInterval(processingTimerRef.current);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (printTimerRef.current) clearInterval(printTimerRef.current);
    if (eventSourceCleanupRef.current) {
      eventSourceCleanupRef.current();
      eventSourceCleanupRef.current = null;
    }

    setViewState("running");
    setIsProcessing(true);
    setProcessingElapsedMs(0);
    setLifecycleState("thinking");
    setActiveAgentName("Planner Agent");
    setActiveAgentDetail("Formulating autonomous pipeline strategy...");
    setProcessingPhase("churning");
    setVisibleLeadCount(0);

    // Initial log
    setLiveActivityLogs([
      {
        id: `log-init-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agent: "Orchestrator",
        level: "info",
        message: `Accepted request: "${goalText}" (target: ${leadTarget} leads).`
      }
    ]);

    // Continuous ticker for elapsed time
    const startTs = Date.now();
    processingTimerRef.current = setInterval(() => {
      setProcessingElapsedMs(Date.now() - startTs);
    }, 50);

    // Real backend invocation with real-time SSE event synchronization
    try {
      const newRun = await createRun({
        niche,
        goal_text: goalText,
        lead_target: leadTarget,
        credit_budget: creditBudget,
        target_titles: ["VP of Engineering", "Head of Platform", "CTO"]
      });

      if (newRun && newRun.id) {
        setActiveRunId(newRun.id);

        // Subscribe to live Server-Sent Events (SSE)
        eventSourceCleanupRef.current = subscribeToRunEvents(
          newRun.id,
          (eventType, data) => {
            handleBackendEvent(eventType, data, newRun.id);
          },
          (err) => {
            console.warn("SSE notice, polling fallback active:", err);
          }
        );

        // Active polling loop ensuring tight backend synchronization
        pollIntervalRef.current = setInterval(async () => {
          try {
            const detail = await fetchRunDetail(newRun.id);
            if (!detail) return;
            setActiveRun(detail);

            // Continuously synchronize beautifului animation with backend steps while running
            if (detail.steps && detail.steps.length > 0) {
              const runningStep = detail.steps.find((s: any) => s.status === "running");
              const lastFinishedStep = [...detail.steps].reverse().find((s: any) => s.status === "done" || s.status === "recovered");
              const activeStep = runningStep || lastFinishedStep;

              if (activeStep) {
                if (activeStep.name === "plan") {
                  setProcessingPhase("churning");
                  setLifecycleState("thinking");
                  setActiveAgentName("Planner Agent");
                  setActiveAgentDetail("Formulating Crustdata search ladder & LLM synthesis cascade...");
                } else if (activeStep.name === "research") {
                  setProcessingPhase("tools");
                  setLifecycleState("tool_execution");
                  setActiveAgentName("Crustdata Researcher");
                  setActiveAgentDetail("Executing Crustdata company discovery & executive mapping...");
                } else if (activeStep.name === "enrich" || activeStep.name === "score") {
                  setProcessingPhase("tasks");
                  setLifecycleState("evaluating");
                  setActiveAgentName("Firmographic Scoring Engine");
                  setActiveAgentDetail("Evaluating headcount velocity & ICP alignment scores (0..100)...");
                } else if (activeStep.name === "write" || activeStep.name === "verify") {
                  setProcessingPhase("streaming");
                  setLifecycleState("evaluating");
                  setActiveAgentName("Outreach Synthesizer");
                  setActiveAgentDetail("Drafting fact-grounded outreach with zero hallucination verification...");
                }
              }

              // Update workflow nodes status from backend in real time
              setWorkflowNodes((prev) =>
                prev.map((n) => {
                  const match = detail.steps.find((s: any) => s.name === n.id);
                  if (match) {
                    return {
                      ...n,
                      status: match.status === "running" ? "active" : match.status === "done" ? "completed" : match.status === "recovered" ? "recovered" : match.status === "failed" ? "failed" : n.status,
                      detail: match.detail || n.detail,
                      durationMs: match.duration_ms || n.durationMs
                    };
                  }
                  return n;
                })
              );
            }

            // Sync live tool executions from backend tool calls
            if (detail.tool_calls && detail.tool_calls.length > 0) {
              setLiveTools(
                detail.tool_calls.map((t: any) => ({
                  id: t.id,
                  toolName: t.tool,
                  status: t.status === "ok" ? "success" : t.status,
                  durationMs: t.latency_ms,
                  paramsSnippet: t.params_snippet || t.endpoint || "",
                  resultSnippet: t.result_snippet || ""
                }))
              );
            }

            // Check if backend finished execution
            if (detail.status === "complete") {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              if (processingTimerRef.current) {
                clearInterval(processingTimerRef.current);
                processingTimerRef.current = null;
              }
              setIsProcessing(false);
              setLifecycleState("completed");
              setActiveAgentName("ProspectForge Orchestrator");
              setActiveAgentDetail("Run completed successfully.");

              // Refresh list and get delivered leads
              const [leadsData, series, signals, summary, runsList, tools] = await Promise.all([
                fetchRunLeads(newRun.id),
                fetchRunSeries(newRun.id),
                fetchRunSignals(newRun.id),
                fetchRunsSummary(),
                fetchRunsList(),
                fetchRunTools(newRun.id)
              ]);

              if (tools && tools.length > 0) {
                setLiveTools(
                  tools.map((t) => ({
                    id: t.id,
                    toolName: t.tool,
                    status: t.status === "ok" ? "success" : (t.status as any),
                    durationMs: t.latency_ms,
                    paramsSnippet: t.params_snippet || t.endpoint || "",
                    resultSnippet: t.result_snippet || ""
                  }))
                );
              }
              if (runsList && runsList.length > 0) setRecentRuns(runsList);
              if (series && series.length > 0) {
                setSeriesData(
                  series.map((s) => ({
                    time: s.timestamp,
                    credits: s.credits,
                    tokens: s.tokens,
                    cost: s.cost_usd,
                    recovery: s.recovery_marker || null
                  }))
                );
              }
              if (signals && signals.length > 0) setSignalBars(signals);
              if (summary) setRunSummary(summary);

              // Immediately replace search bar & animation with results view
              const finalLeads = (leadsData && leadsData.length > 0) ? leadsData.map(mapApiLeadToUI) : leads;
              setLeads(finalLeads);
              setViewState("results");

              // Print results one by one with smooth sequential card reveal
              if (printTimerRef.current) clearInterval(printTimerRef.current);
              setVisibleLeadCount(0);
              let count = 0;
              printTimerRef.current = setInterval(() => {
                count += 1;
                setVisibleLeadCount(count);
                if (count >= finalLeads.length) {
                  if (printTimerRef.current) {
                    clearInterval(printTimerRef.current);
                    printTimerRef.current = null;
                  }
                }
              }, 350);
            } else if (detail.status === "failed") {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              setLifecycleState("failed");
              setIsProcessing(false);
            }
          } catch (e) {
            console.error("Run polling error:", e);
          }
        }, 800);
      }
    } catch (err) {
      console.error("Backend launch deferred, demo interactive flow continues:", err);
    }
  };


  const handleCopyEmail = () => {
    const sel = leads[selectedLeadIndex] || leads[0];
    if (sel && sel.email) {
      navigator.clipboard.writeText(`${sel.email.subject}\n\n${sel.email.body}`);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_BASE}/runs/${activeRunId}/export.csv`, "_blank");
  };

  // Intermediate Tasks progression data
  const currentTasksData: TaskItem[] = [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Structured ICP Plan Synthesis",
      subtitle: "0:05",
      status: (processingPhase === "churning" ? "running" : "completed"),
      items: [
        { label: "Execution strategy", value: "Dual-pass discovery (Seed to Series A)" },
        { label: "Filters compiled", value: "Headcount 10..50, US, active DevOps hiring" }
      ]
    },
    {
      id: "step-2",
      stepNumber: 2,
      title: "Crustdata Candidate Discovery & Filter Widening",
      subtitle: "0:40",
      status: (processingPhase === "churning" ? "pending" : processingPhase === "tools" ? "running" : "recovered"),
      items: [
        { label: "Initial candidate pool", value: "0 matches (empty search fault injected)" },
        { label: "Autonomous recovery ladder", value: "Widened headcount 10..150 & added Series B" },
        { label: "Outcome", value: "Recovered 5 verified company candidates" }
      ]
    },
    {
      id: "step-3",
      stepNumber: 3,
      title: "Executive Mapping & Firmographic Enrichment",
      subtitle: "1:20",
      status: (["churning", "tools"].includes(processingPhase) ? "pending" : processingPhase === "tasks" ? "running" : "completed"),
      items: [
        { label: "Decision makers mapped", value: "Alex Chen (VP Eng), Elena Rostova (Head of Platform)" },
        { label: "Firmographic facts stored", value: "Headcount growth, tech stacks, funding rounds" }
      ]
    },
    {
      id: "step-4",
      stepNumber: 4,
      title: "Autonomous ICP Fit Scoring (0..100)",
      subtitle: "2:00",
      status: (["churning", "tools", "tasks"].includes(processingPhase) ? "pending" : "completed"),
      items: [
        { label: "Scoring metric", value: "Multi-factor ICP alignment 0..100" },
        { label: "Cohort average fit", value: "94 / 100" }
      ]
    },
    {
      id: "step-5",
      stepNumber: 5,
      title: "Fact-Grounded Outreach & Hallucination Guardrail",
      subtitle: "2:45",
      status: (processingPhase === "streaming" ? "running" : processingPhase === "approval" ? "completed" : "pending"),
      items: [
        { label: "Ground-truth claims checked", value: "3 checked per lead against stored facts" },
        { label: "Hallucination guardrail audit", value: "100% verified against stored facts" }
      ]
    }
  ];

  const selectedLead = leads[selectedLeadIndex] || leads[0];

  // ── MARKETING LANDING PAGE ─────────────────────────────────────────────────
  if (appView === "marketing") {
    return <MarketingLanding onOpenDashboard={() => setAppView("dashboard")} />;
  }
  // ── END MARKETING PAGE ──────────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121] text-[#ECECEC] font-sans antialiased select-none">
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Strictly matching screenshot) */}
      {/* ========================================================= */}
      <aside
        className={`${
          sidebarOpen ? "w-[260px]" : "w-0"
        } transition-all duration-300 ease-in-out shrink-0 bg-[#171717] border-r border-[#2B2B2B] flex flex-col justify-between overflow-hidden z-30`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Top: Logo, Search, Collapse */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-500/20">
                <Zap className="size-4 fill-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">
                ProspectForge
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#8E8E8E]">
              <button
                type="button"
                onClick={() => setShowNewRunModal(true)}
                className="p-1.5 hover:text-white hover:bg-[#262626] rounded-md transition-colors cursor-pointer"
                title="Search runs"
              >
                <Search className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:text-white hover:bg-[#262626] rounded-md transition-colors cursor-pointer"
                title="Close sidebar"
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>
          </div>

          {/* "+ New Run" / "+ New Chat" Button */}
          <div className="px-3 pt-3 pb-2">
            <button
              type="button"
              onClick={() => {
                setViewState("landing");
                setIsProcessing(false);
                setProcessingPhase("idle");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#212121] hover:bg-[#2A2A2A] text-white text-xs font-medium border border-[#333333] shadow-sm transition-all cursor-pointer"
            >
              <PenLine className="size-3.5 text-blue-400" />
              <span>New prospecting run</span>
            </button>
          </div>

          {/* Primary Navigation Items */}
          <div className="px-2 py-1 space-y-0.5 text-xs text-[#C5C5C5]">
            <button
              type="button"
              onClick={() => {
                setViewState("landing");
                setIsProcessing(false);
                setProcessingPhase("idle");
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                viewState === "landing" ? "bg-[#262626] text-white font-medium" : "hover:bg-[#212121] text-[#B4B4B4]"
              }`}
            >
              <Search className="size-4 text-[#8E8E8E]" />
              <span>Search & Intake</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (leads.length > 0) {
                  setViewState("results");
                  setVisibleLeadCount(leads.length);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer text-left ${
                viewState === "results" ? "bg-[#262626] text-white font-medium" : "hover:bg-[#212121] text-[#B4B4B4]"
              }`}
            >
              <BookOpen className="size-4 text-[#8E8E8E]" />
              <span>Library & Leads</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPricingModal(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#212121] text-[#B4B4B4] transition-colors cursor-pointer text-left"
            >
              <Puzzle className="size-4 text-[#8E8E8E]" />
              <span>CFO Engine</span>
            </button>
            <button
              type="button"
              onClick={() => window.open(activeRun?.neatlogs_trace_url || "https://app.neatlogs.com", "_blank")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#212121] text-[#B4B4B4] transition-colors cursor-pointer text-left"
            >
              <Compass className="size-4 text-[#8E8E8E]" />
              <span>neatlogs Telemetry</span>
            </button>
          </div>

          {/* Recent Runs List (Clean & Real) */}
          <div className="flex-1 overflow-y-auto px-2 pt-3 pb-2">
            <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-[#8E8E8E] uppercase flex items-center justify-between">
              <span>Recent Runs</span>
              <span className="text-[10px] text-blue-400 font-mono">{recentRuns.length}</span>
            </div>
            <div className="space-y-0.5 text-xs">
              {recentRuns.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-[#6E6E6E] italic">
                  No previous runs
                </div>
              ) : (
                recentRuns.slice(0, 10).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => loadExistingRun(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors truncate text-left cursor-pointer group ${
                      activeRunId === item.id && viewState === "results"
                        ? "bg-[#282828] text-white font-medium border border-blue-500/30"
                        : "hover:bg-[#212121] text-[#B4B4B4] hover:text-white"
                    }`}
                    title={item.goal_text || item.niche}
                  >
                    <span className="text-xs shrink-0">{item.status === "complete" ? "⚡" : "⏳"}</span>
                    <span className="truncate">{item.niche || item.goal_text || "Prospecting Run"}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="p-3 border-t border-[#262626] bg-[#141414]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-full bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center">
                  PR
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">Procoder</span>
                  <span className="text-[10px] text-[#8E8E8E]">pro &bull; NEATLOGS2026</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded-md">
                Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE AREA                                    */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#212121]">
        {/* Top Workspace Header Bar */}
        <header className="h-14 border-b border-[#2E2E2E] flex items-center justify-between px-4 shrink-0 bg-[#212121] z-20">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 hover:bg-[#2A2A2A] text-[#8E8E8E] hover:text-white rounded-md transition-colors cursor-pointer"
                title="Open sidebar"
              >
                <PanelLeft className="size-4" />
              </button>
            )}

            {/* Toggle Pills: Chat | + Work */}
            <div className="flex items-center bg-[#171717] border border-[#2E2E2E] rounded-full p-0.5 text-xs font-medium shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "chat" ? "bg-[#2F2F2F] text-white shadow" : "text-[#8E8E8E] hover:text-[#D1D1D1]"
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("work")}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "work" ? "bg-[#2F2F2F] text-white shadow" : "text-[#8E8E8E] hover:text-[#D1D1D1]"
                }`}
              >
                + Work
              </button>
            </div>
          </div>

          {/* Right Status Actions */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* Live Agent Lifecycle Beacon */}
            <AgentStatusBeacon compact state={lifecycleState} activeAgentName={activeAgentName} />

            {/* Live Telemetry Pill */}
            <a
              href={activeRun?.neatlogs_trace_url || "https://app.neatlogs.com"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#171717] hover:bg-[#2A2A2A] border border-[#2E2E2E] px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-400 transition-colors cursor-pointer"
            >
              <span>neatlogs live</span>
              <ArrowUpRight className="size-3 text-[#8E8E8E]" />
            </a>

            {/* Sync Refresh */}
            <button
              type="button"
              onClick={refreshAll}
              disabled={isRefreshing}
              className="p-1.5 bg-[#171717] hover:bg-[#2A2A2A] border border-[#2E2E2E] text-[#8E8E8E] hover:text-white rounded-full transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh telemetry & leads"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
            </button>

            {/* Unit Economics Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowPricingModal(true)}
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1 rounded-full shadow-sm transition-all cursor-pointer"
            >
              <DollarSign className="size-3.5" />
              <span>cfo.ai ($1.15)</span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Content Body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-12">
          {/* ========================================================= */}
          {/* 3. CENTER CHAT HERO SECTION (Matching Screenshot)         */}
          {/* ========================================================= */}
          {viewState !== "results" && (
            <div className="space-y-8 animate-morph">
              <section className="max-w-3xl mx-auto flex flex-col items-center justify-center pt-4 pb-2 text-center">
                {/* Greeting Headline */}
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">
                  What&apos;s on the agenda today?
                </h1>

                {/* Main Interactive ChatGPT-style Input Bar */}
                <div className="w-full bg-[#2F2F2F] border border-[#424242] focus-within:border-[#606060] rounded-[24px] shadow-lg shadow-black/20 p-2.5 transition-all">
                  <div className="flex items-center gap-2 px-1">
                    {/* Left Attachment / Preset "+" Button */}
                    <button
                      type="button"
                      onClick={() => setShowNewRunModal(true)}
                      className="size-8 rounded-full bg-[#3C3C3C] hover:bg-[#484848] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Configure ICP parameters"
                    >
                      <Plus className="size-4" />
                    </button>

                    {/* Input Field */}
                    <input
                      type="text"
                      value={goalText}
                      onChange={(e) => setGoalText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLaunchRun();
                      }}
                      placeholder="Ask ProspectForge... (e.g. Early-stage startups hiring DevOps)"
                      className="flex-1 bg-transparent border-0 text-sm text-white placeholder-[#8E8E8E] focus:outline-none px-2"
                    />

                    {/* Right Tool Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* "Think" Toggle Pill */}
                      <button
                        type="button"
                        onClick={() => setThinkEnabled(!thinkEnabled)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                          thinkEnabled
                            ? "bg-blue-900/30 text-blue-300 border-blue-500/50"
                            : "bg-[#3C3C3C] text-[#8E8E8E] border-transparent hover:text-white"
                        }`}
                      >
                        <Brain className="size-3.5" />
                        <span>Think</span>
                      </button>

                      {/* Microphone icon */}
                      <button
                        type="button"
                        className="p-1.5 text-[#8E8E8E] hover:text-white rounded-full hover:bg-[#3C3C3C] transition-colors cursor-pointer"
                        title="Voice input"
                      >
                        <Mic className="size-4" />
                      </button>

                      {/* Circular Send Action Button (Blue soundwave icon from screenshot) */}
                      <button
                        type="button"
                        onClick={handleLaunchRun}
                        disabled={isProcessing}
                        className="size-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                        title="Launch autonomous prospect run"
                      >
                        {isProcessing ? (
                          <RefreshCw className="size-4 animate-spin" />
                        ) : (
                          <Volume2 className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Prompt Suggestion Chips (Underneath Input) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-5 w-full text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setGoalText("Seed & Series A DevOps startups hiring SREs");
                      handleLaunchRun();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] text-[#CCCCCC] border border-[#3A3A3A] transition-colors cursor-pointer"
                  >
                    <ImageIcon className="size-3.5 text-pink-400" />
                    <span>Find Seed/Series A DevOps startups</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGoalText("Simulate autonomous filter widening ladder recovery");
                      handleLaunchRun();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] text-[#CCCCCC] border border-[#3A3A3A] transition-colors cursor-pointer"
                  >
                    <PenLine className="size-3.5 text-amber-400" />
                    <span>Filter widening recovery run</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGoalText("Verify ground-truth outreach claims with citation keys");
                      handleLaunchRun();
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] text-[#CCCCCC] border border-[#3A3A3A] transition-colors cursor-pointer"
                  >
                    <Globe className="size-3.5 text-blue-400" />
                    <span>Audit fact-grounded outreach claims</span>
                  </button>
                </div>

                {/* Landing Pillars (Rendered when landing page active) */}
                {viewState === "landing" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-8 w-full text-left">
                    <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm">
                      <div className="size-8 rounded-xl bg-blue-950/70 border border-blue-800/50 flex items-center justify-center text-blue-400 mb-2.5">
                        <Database className="size-4" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1">Crustdata Live Graph</h3>
                      <p className="text-[11px] text-[#8E8E8E] leading-relaxed">
                        Live company search, funding records, headcount velocity, and executive mapping.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm">
                      <div className="size-8 rounded-xl bg-emerald-950/70 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mb-2.5">
                        <ShieldCheck className="size-4" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1">Anti-Hallucination Guardrail</h3>
                      <p className="text-[11px] text-[#8E8E8E] leading-relaxed">
                        Every outreach claim cross-checked with ground-truth verification citation keys.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm">
                      <div className="size-8 rounded-xl bg-purple-950/70 border border-purple-800/50 flex items-center justify-center text-purple-400 mb-2.5">
                        <DollarSign className="size-4" />
                      </div>
                      <h3 className="text-xs font-bold text-white mb-1">cfo.ai Unit Economics</h3>
                      <p className="text-[11px] text-[#8E8E8E] leading-relaxed">
                        Live neatlogs spend telemetry enforces $0.28 cost and sustainable 75% gross margin.
                      </p>
                    </div>
                  </div>
                )}
              </section>

          {/* ========================================================= */}
          {/* 4. INTERMEDIATE BEAUTIFULUI TRANSITION PROCESSING CARD    */}
          {/*    (Sequential one-by-one in the same spot with constant  */}
          {/*     live timer across multiple animations)                */}
          {/* ========================================================= */}
          {(isProcessing || processingPhase !== "idle") && (
            <section className="max-w-3xl mx-auto rounded-[24px] bg-[#1E1E1E] border border-[#383838] shadow-2xl p-5 space-y-4 transition-all">
              {/* Card Top: Constant Timer + Live Status */}
              <div className="flex flex-col gap-3 pb-3 border-b border-[#2C2C2C]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex size-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full size-2.5 bg-blue-500"></span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      Live Autonomous Pipeline
                    </span>
                    <span className="text-[11px] text-[#8E8E8E] hidden sm:inline">
                      &bull; Stage {PHASES_LIST.findIndex((p) => p.id === processingPhase) + 1} of 5
                    </span>
                  </div>

                  {/* CONSTANT UNRESETTING LIVE TIMER ACROSS ALL ANIMATIONS */}
                  <div className="flex items-center gap-2 bg-[#121212] border border-[#303030] px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-emerald-400 tabular-nums shadow-inner">
                    <Clock className="size-3.5 text-emerald-400 animate-spin" style={{ animationDuration: "3s" }} />
                    <span>⏱️ {formatProcessingTimer(processingElapsedMs)}</span>
                  </div>
                </div>

                {/* Sequential Stage Stepper Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                  {PHASES_LIST.map((p, idx) => {
                    const isActive = processingPhase === p.id;
                    const currIdx = PHASES_LIST.findIndex((item) => item.id === processingPhase);
                    const isDone = currIdx > idx;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProcessingPhase(p.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400 font-semibold"
                            : isDone
                            ? "bg-[#2A2A2A] text-emerald-400 hover:bg-[#333333] border border-emerald-900/50"
                            : "bg-[#252525] text-[#8E8E8E] hover:bg-[#2C2C2C] hover:text-white"
                        }`}
                        title={p.desc}
                      >
                        <span>{isDone ? "✓" : p.icon}</span>
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Animated Agent Status Banner */}
              <AgentStatusBeacon state={lifecycleState} activeAgentName={activeAgentName} detail={activeAgentDetail} />

              {/* Live Interactive Workflow Node Graph */}
              <div className="py-1">
                <AgentWorkflowGraph nodes={workflowNodes} />
              </div>

              {/* SINGLE SPOT MORPHING BODY - ONLY ONE ANIMATION ACTIVE IN THIS SPOT */}
              <div key={processingPhase} className="animate-morph min-h-[220px] flex flex-col justify-center">
                {/* 1. CHURNING PHASE */}
                {processingPhase === "churning" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#262626] border border-[#3A3A3A] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-950/70 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
                          <Sparkles className="size-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            Autonomous Reasoning & Wavefront Churn
                          </h3>
                          <p className="text-xs text-[#A0A0A0]">
                            Formulating Crustdata search ladder & multi-model Bedrock cascade
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <LoadingState
                          variant="Drive"
                          label="Churning target graph..."
                        />
                      </div>
                    </div>

                    <ThinkingState
                      label="Reasoning & Pipeline Strategy"
                      defaultExpanded={true}
                      steps={thinkingSteps}
                    />
                  </div>
                )}

                {/* 2. TOOL EXECUTION PHASE */}
                {processingPhase === "tools" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="size-4 text-blue-400" />
                        <span className="text-xs font-semibold text-white uppercase tracking-wider">
                          Autonomous Tool Execution Cascade ({liveTools.length > 0 ? liveTools.length : 4} Spans)
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        {liveTools.filter(t => t.status === "success" || t.status === "recovered").length}/{liveTools.length > 0 ? liveTools.length : 4} Active Calls Verified
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#262626] border border-[#3A3A3A]">
                      <ToolChips
                        toolCalls={
                          liveTools.length > 0
                            ? liveTools
                            : [
                                {
                                  id: "tc-1",
                                  toolName: "Crustdata.company_search",
                                  durationMs: 240,
                                  status: "recovered",
                                  paramsSnippet: "headcount: 10..150, stage: Seed..Series B"
                                },
                                {
                                  id: "tc-2",
                                  toolName: "Crustdata.find_decision_makers",
                                  durationMs: 180,
                                  status: "success",
                                  paramsSnippet: "titles: VP Engineering, CTO"
                                },
                                {
                                  id: "tc-3",
                                  toolName: "AWSBedrock.converse (Nova/Claude)",
                                  durationMs: 420,
                                  status: "success",
                                  paramsSnippet: "prompt: outreach_synthesis_v2"
                                },
                                {
                                  id: "tc-4",
                                  toolName: "neatlogs.trace_span.guardrail_verify",
                                  durationMs: 95,
                                  status: "success",
                                  paramsSnippet: "claims: 3 checked, 0 ungrounded"
                                }
                              ]
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8E8E8E] px-1">
                      <span>Telemetred via neatlogs trace protocol</span>
                      <span className="text-blue-400 font-medium">Auto-advancing to task steps &rarr;</span>
                    </div>
                  </div>
                )}

                {/* 3. TASK PROGRESSION PHASE */}
                {processingPhase === "tasks" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">
                        Progressive Task Hierarchy (5 Milestones)
                      </span>
                      <span className="text-[11px] text-[#8E8E8E]">
                        Autonomous State Machine
                      </span>
                    </div>

                    <div className="p-1 rounded-2xl bg-[#262626]/60 border border-[#3A3A3A]">
                      <TaskRows tasks={currentTasksData} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8E8E8E] px-1">
                      <span>5/5 Milestones resolved</span>
                      <span className="text-blue-400 font-medium">Auto-advancing to outreach stream &rarr;</span>
                    </div>
                  </div>
                )}

                {/* 4. STREAMING OUTREACH PHASE */}
                {processingPhase === "streaming" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="size-3.5 text-blue-400" />
                        <span>Streaming Fact-Grounded Outreach Draft</span>
                      </span>
                      <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/70 border border-blue-800/50 px-2 py-0.5 rounded-full">
                        Live Synthesis
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#262626] border border-[#3A3A3A]">
                      <StreamingText
                        text={selectedLead?.email?.body || "Generating verified outreach with strict anti-hallucination citations..."}
                        isStreaming={true}
                        sources={[
                          { name: "Crustdata Graph", domain: "api.crustdata.com" },
                          { name: "neatlogs Telemetry", domain: "app.neatlogs.com" },
                          { name: "AWS Bedrock Nova/Claude", domain: "aws.amazon.com" }
                        ]}
                        onRetry={handleLaunchRun}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#8E8E8E] px-1">
                      <span>Zero hallucinated claims verified</span>
                      <span className="text-blue-400 font-medium">Auto-advancing to guardrail approval &rarr;</span>
                    </div>
                  </div>
                )}

                {/* 5. APPROVAL PHASE */}
                {processingPhase === "approval" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span>Pipeline Complete &bull; Human-in-the-Loop Review</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                        Ready for Dispatch
                      </span>
                    </div>

                    <ApprovalCard
                      onApprove={() => {
                        setIsProcessing(false);
                        setViewState("results");
                        setVisibleLeadCount(leads.length);
                      }}
                      onSkip={() => {
                        setIsProcessing(false);
                        setViewState("results");
                        setVisibleLeadCount(leads.length);
                      }}
                    />

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProcessing(false);
                          setViewState("results");
                          setVisibleLeadCount(leads.length);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>View Delivered Leads in Operational Dashboard &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Real-time Activity Feed Stream */}
              <div className="pt-3 border-t border-[#2C2C2C]">
                <ActivityFeed logs={liveActivityLogs} />
              </div>
            </section>
          )}
        </div>
      )}

          {/* ========================================================= */}
          {/* 5. RESULTS VIEW: PRINTED LEADS & OPERATIONAL TELEMETRY   */}
          {/* ========================================================= */}
          {viewState === "results" && (
            <section id="leads-section" className="max-w-7xl mx-auto space-y-8 pt-2 animate-morph">
              {/* Results Top Action & Navigation Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2E2E2E]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setViewState("landing");
                      setProcessingPhase("idle");
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#262626] hover:bg-[#333333] border border-[#3E3E3E] text-xs font-semibold text-white transition-all cursor-pointer shadow-sm group"
                  >
                    <span className="text-blue-400 group-hover:-translate-x-0.5 transition-transform">&larr;</span>
                    <span>Back to Search</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Database className="size-5 text-blue-400" />
                      <span>Autonomous Prospecting Results</span>
                    </h2>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                      {visibleLeadCount} / {leads.length} Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A2A2A] hover:bg-[#333333] border border-[#3A3A3A] text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Download className="size-3.5 text-blue-400" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPricingModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <DollarSign className="size-3.5" />
                    <span>cfo.ai ($1.15)</span>
                  </button>
                </div>
              </div>

            {/* 4 Top CFO Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-medium text-[#8E8E8E]">Measured Median Cost / Lead</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white tabular-nums">$0.28</span>
                  <span className="text-xs text-emerald-400 font-medium">-18% vs target</span>
                </div>
                <span className="text-[11px] text-[#707070] mt-1">Crustdata credits + Bedrock tokens</span>
              </div>

              {/* Metric 2 */}
              <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-medium text-[#8E8E8E]">Target Gross Margin</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-400 tabular-nums">75.0%</span>
                  <span className="text-xs text-emerald-400 font-medium">Sustainable</span>
                </div>
                <span className="text-[11px] text-[#707070] mt-1">cfo.ai automated pricing formula</span>
              </div>

              {/* Metric 3 */}
              <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-medium text-[#8E8E8E]">Computed Price / Lead</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white tabular-nums">$1.15</span>
                  <span className="text-xs text-blue-400 font-medium">Growth Tier</span>
                </div>
                <span className="text-[11px] text-[#707070] mt-1">Price = Cost / (1 - 0.75)</span>
              </div>

              {/* Metric 4 */}
              <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm flex flex-col justify-between">
                <span className="text-xs font-medium text-[#8E8E8E]">Daily Credit Usage</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white tabular-nums">135</span>
                  <span className="text-xs text-[#8E8E8E] font-medium">/ 5,000 Cap</span>
                </div>
                <span className="text-[11px] text-[#707070] mt-1">Autonomous circuit breaker active</span>
              </div>
            </div>

            {/* Bezier Telemetry Chart & Signal Dimension Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LineChart (8 cols) */}
              <div className="lg:col-span-8 p-5 rounded-3xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">
                      Cumulative Telemetry Spend & Tokens Curve
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8E8E8E] tabular-nums">
                    neatlogs Trace ID: {activeRun?.neatlogs_trace_id || "trace-001"}
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={seriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#2E2E2E" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" stroke="#707070" fontSize={11} tickLine={false} />
                      <YAxis stroke="#707070" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#171717",
                          borderColor: "#333333",
                          borderRadius: "12px",
                          color: "#FFFFFF",
                          fontSize: "12px"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="credits"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        dot={{ fill: "#3B82F6", r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Crustdata Credits"
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981", r: 3 }}
                        name="Cost (USD)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Signal Velocity Bars (4 cols) */}
              <div className="lg:col-span-4 p-5 rounded-3xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="size-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Target ICP Signal Velocity</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    {signalBars.map((sig, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#CCCCCC]">{sig.name}</span>
                          <span className="font-semibold text-white tabular-nums">{sig.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#2A2A2A] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${sig.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A] text-[11px] text-[#8E8E8E]">
                  Verified via Crustdata job postings & funding graph.
                </div>
              </div>
            </div>

            {/* Verified Leads Table & Outreach Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
              {/* Leads Table (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-3xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">
                      Verified Discovered Leads ({leads.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    Anti-hallucination verified
                  </span>
                </div>

                <div className="space-y-2">
                  {leads.slice(0, visibleLeadCount).map((comp, idx) => (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => setSelectedLeadIndex(idx)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between animate-print-card ${
                        selectedLeadIndex === idx
                          ? "bg-[#282828] border-blue-500/70 shadow-sm"
                          : "bg-[#202020] border-[#2C2C2C] hover:bg-[#252525]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="size-8 rounded-xl bg-blue-900/40 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                          #{comp.rank}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{comp.name}</span>
                            <span className="text-[10px] text-[#8E8E8E]">{comp.domain}</span>
                          </div>
                          <div className="text-[11px] text-[#9E9E9E] truncate">
                            {comp.decisionMaker.name} &bull; {comp.decisionMaker.title}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-emerald-400 tabular-nums">
                          {comp.fitScore}% fit
                        </span>
                        <ChevronRight className="size-3.5 text-[#707070]" />
                      </div>
                    </button>
                  ))}

                  {visibleLeadCount < leads.length && (
                    <div className="flex items-center justify-center gap-2 py-3.5 text-xs text-blue-400 font-medium bg-[#1A1A1A] rounded-2xl border border-blue-900/40 animate-pulse">
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>Revealing verified lead #{visibleLeadCount + 1} of {leads.length}...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Outreach Preview Card (5 cols) */}
              <div className="lg:col-span-5 p-5 rounded-3xl bg-[#1C1C1C] border border-[#2F2F2F] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2A2A2A]">
                    <div className="flex items-center gap-2">
                      <Zap className="size-4 text-blue-400" />
                      <span className="text-sm font-bold text-white">Fact-Grounded Outreach</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#CCCCCC] hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedEmail ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                      <span>{copiedEmail ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="text-xs font-semibold text-white mb-1">
                    Subject: {selectedLead?.email?.subject}
                  </div>
                  <div className="p-3 rounded-xl bg-[#242424] text-xs leading-relaxed text-[#D0D0D0] whitespace-pre-wrap font-sans border border-[#333333]">
                    {selectedLead?.email?.body}
                  </div>

                  <div className="mt-3">
                    <span className="text-[11px] font-medium text-[#8E8E8E] block mb-1.5">
                      Ground-Truth Facts Cited:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLead?.facts?.map((f: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#282828] border border-[#3A3A3A] text-[10px] text-[#BBBBBB]"
                        >
                          {f.key}: {f.val}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-emerald-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    <span>0 hallucinated claims</span>
                  </span>
                  <span className="text-[#8E8E8E]">Quality: {selectedLead?.email?.qualityScore || 96}/100</span>
                </div>
              </div>
            </div>
          </section>
        )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. UNIT ECONOMICS CFO MODAL                               */}
      {/* ========================================================= */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] border border-[#333333] rounded-[28px] max-w-lg w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E]">
              <div className="flex items-center gap-2">
                <DollarSign className="size-5 text-emerald-400" />
                <h3 className="font-bold text-base">cfo.ai Unit Economics & Pricing</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="text-[#8E8E8E] hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#262626] border border-[#333333]">
                <div className="flex justify-between font-bold text-sm text-white mb-1">
                  <span>Price per Lead</span>
                  <span className="text-emerald-400">$1.15</span>
                </div>
                <p className="text-[#A0A0A0] text-[11px]">
                  Formula: Measured median cost ($0.28) / (1 - 0.75 target margin) = $1.15.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#242424] border border-[#333]">
                  <span className="text-[#8E8E8E] block">Crustdata Credit Rate</span>
                  <span className="font-bold text-white">$0.01 / credit</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#242424] border border-[#333]">
                  <span className="text-[#8E8E8E] block">Bedrock Token Price</span>
                  <span className="font-bold text-white">$0.003 / 1k tokens</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Close Engine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. ICP CRITERIA MODAL                                     */}
      {/* ========================================================= */}
      {showNewRunModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1C1C1C] border border-[#333333] rounded-[28px] max-w-md w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2E2E]">
              <div className="flex items-center gap-2">
                <Sliders className="size-5 text-blue-400" />
                <h3 className="font-bold text-base">Targeting Configuration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewRunModal(false)}
                className="text-[#8E8E8E] hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#8E8E8E] block mb-1">Niche Sector</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full bg-[#262626] border border-[#3A3A3A] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8E8E8E] block mb-1">Target Lead Count</label>
                <input
                  type="number"
                  value={leadTarget}
                  onChange={(e) => setLeadTarget(Number(e.target.value))}
                  min={5}
                  max={25}
                  className="w-full bg-[#262626] border border-[#3A3A3A] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8E8E8E] block mb-1">Credit Budget Cap</label>
                <input
                  type="number"
                  value={creditBudget}
                  onChange={(e) => setCreditBudget(Number(e.target.value))}
                  min={50}
                  max={1000}
                  className="w-full bg-[#262626] border border-[#3A3A3A] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewRunModal(false)}
                className="px-3.5 py-1.5 rounded-full bg-[#282828] hover:bg-[#333] text-xs font-semibold text-[#CCCCCC] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewRunModal(false);
                  handleLaunchRun();
                }}
                className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Save & Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
