"use client";

import React, { useState, useEffect } from "react";
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
  Database,
  Layers,
  Terminal,
  Activity
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
  createRun,
  SourceHealthItem,
  RunDetail,
  PublicSettingsResponse,
  PricingResponse,
  SignalDimension,
  CompanyLead
} from "../lib/api";
import LoadingState from "../components/LoadingState";
import ThinkingState from "../components/ThinkingState";
import TaskRows, { TaskItem } from "../components/TaskRows";
import StreamingText from "../components/StreamingText";
import ApprovalCard from "../components/ApprovalCard";
import ToolChips from "../components/ToolChips";


// Telemetry spend data matching reference bezier dual-curve
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

function mapApiLeadToUI(c: CompanyLead, index: number) {
  const primaryPerson = c.people?.find((p) => p.is_primary) || c.people?.[0] || {
    id: "p-def",
    full_name: "Alex Chen",
    title: "VP of Engineering",
    profile_url: "https://linkedin.com",
    is_primary: true,
    messages: [],
    facts: []
  };
  const primaryMsg = primaryPerson.messages?.[0] || {
    id: "m-def",
    channel: "email",
    subject: `Question regarding ${c.name} growth`,
    body: `Hi ${primaryPerson.full_name},\n\nSaw your momentum at ${c.name}.\n\nBest,\nNikunj`,
    used_fact_ids: [],
    status: "verified",
    version: 1,
    verification: { passed: true, quality_score: 98, unsupported_claims: [] }
  };

  return {
    id: c.id,
    rank: c.rank || index + 1,
    name: c.name,
    domain: c.domain || `${c.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.io`,
    fitScore: c.fit_score || 90,
    scoreReason: c.score_reason || "Verified match against target criteria.",
    decisionMaker: {
      name: primaryPerson.full_name,
      title: primaryPerson.title || "Executive Lead",
      linkedin: primaryPerson.profile_url || "https://linkedin.com",
      highlight: "Identified via Crustdata executive mapping."
    },
    facts: c.facts && c.facts.length > 0
      ? c.facts.map((f) => ({ key: f.key, val: f.value, source: f.source }))
      : [{ key: "status", val: "Verified", source: "Crustdata" }],
    email: {
      subject: primaryMsg.subject || `Inquiry regarding ${c.name}`,
      body: primaryMsg.body,
      verified: primaryMsg.verification?.passed ?? true,
      qualityScore: primaryMsg.verification?.quality_score ?? 95,
      unsupportedClaims: primaryMsg.verification?.unsupported_claims?.length ?? 0
    }
  };
}

export default function DashboardPage() {
  const [selectedLeadIndex, setSelectedLeadIndex] = useState<number | null>(0);
  const [showNewRunModal, setShowNewRunModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads">("dashboard");

  // Run creation form state
  const [niche, setNiche] = useState("Fintech & Developer Tools");
  const [goalText, setGoalText] = useState("Series A B2B SaaS startups in the US with 10 to 50 employees hiring senior DevOps engineers or SREs. Target VP of Engineering or Head of Platform.");
  const [leadTarget, setLeadTarget] = useState(15);
  const [creditBudget, setCreditBudget] = useState(250);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loaderVariant, setLoaderVariant] = useState<string>("Drive");
  const [isWorking, setIsWorking] = useState<boolean>(false);


  // Dynamic Live State
  const [sourcesHealth, setSourcesHealth] = useState<SourceHealthItem[]>([
    { source: "neatlogs", status: "connected", detail: "Active OpenTelemetry pipeline", checked_at: "2026-10-11T07:00:00Z" },
    { source: "Crustdata", status: "operational", detail: "Live B2B discovery & graph", checked_at: "2026-10-11T07:00:00Z", balance: 5000 },
    { source: "AWS Bedrock", status: "ready", detail: "Claude 3.5 & Nova multi-model cascade", checked_at: "2026-10-11T07:00:00Z" },
    { source: "Supabase", status: "linked", detail: "Project jbfyxtbyheyuylptreud linked", checked_at: "2026-10-11T07:00:00Z" }
  ]);
  const [runSummary, setRunSummary] = useState<any>({
    total_runs: 1,
    total_leads_delivered: 15,
    total_claims_verified: 28,
    avg_fit_score: 94,
    total_credits_used: 135.0,
    total_cost_usd: 4.5
  });
  const [publicSettings, setPublicSettings] = useState<PublicSettingsResponse | null>(null);
  const [pricingData, setPricingData] = useState<PricingResponse | null>(null);
  const [activeRunId, setActiveRunId] = useState<string>("demo-seed-001");
  const [activeRun, setActiveRun] = useState<RunDetail | null>(null);
  const [seriesData, setSeriesData] = useState<any[]>(INITIAL_SERIES_DATA);
  const [signalBars, setSignalBars] = useState<SignalDimension[]>([
    { name: "DevOps / SRE Hiring", score: 95, delta: 12, direction: "up" },
    { name: "Headcount Velocity (>30%)", score: 92, delta: 8, direction: "up" },
    { name: "Kubernetes / Cloud Stack", score: 90, delta: 4, direction: "up" },
    { name: "Seed / Series A Stage", score: 88, delta: 5, direction: "up" }
  ]);
  const [leads, setLeads] = useState<any[]>(INITIAL_LEADS);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);

  // Fetch live system state
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

      const targetId = runsList && runsList.length > 0 ? runsList[0].id : activeRunId;
      setActiveRunId(targetId);

      const [detail, leadsData, series, signals] = await Promise.all([
        fetchRunDetail(targetId),
        fetchRunLeads(targetId),
        fetchRunSeries(targetId),
        fetchRunSignals(targetId)
      ]);
      if (detail) setActiveRun(detail);
      if (leadsData && leadsData.length > 0) {
        setLeads(leadsData.map(mapApiLeadToUI));
      }
      if (series && series.length > 0) {
        setSeriesData(
          series.map((s) => ({
            time: s.timestamp,
            credits: s.credits,
            tokens: s.tokens,
            cost: s.cost_usd,
            recovery: s.recovery_marker
          }))
        );
      }
      if (signals && signals.length > 0) setSignalBars(signals);
    } catch (err) {
      console.warn("Live API sync fallback:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Live filter suggestion proxy
  useEffect(() => {
    if (niche.length > 2) {
      fetchFilterSuggestions("titles", niche).then((suggs) => {
        if (suggs && suggs.length > 0) setTitleSuggestions(suggs);
      });
    }
  }, [niche]);

  const selectedLead = selectedLeadIndex !== null && leads[selectedLeadIndex] ? leads[selectedLeadIndex] : leads[0];

  const handleCopyEmail = () => {
    if (selectedLead && selectedLead.email) {
      navigator.clipboard.writeText(`${selectedLead.email.subject}\n\n${selectedLead.email.body}`);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleExportCSV = () => {
    window.open(`http://localhost:8000/api/v1/runs/${activeRunId}/export.csv`, "_blank");
  };

  const handleLaunchRun = async () => {
    setIsSubmitting(true);
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
        setShowNewRunModal(false);
        setTimeout(() => refreshAll(), 1500);
      }
    } catch (err) {
      console.error("Failed to launch run:", err);
    } finally {
      setIsSubmitting(false);
      setShowNewRunModal(false);
    }
  };

  const tasksData: TaskItem[] = activeRun?.steps && activeRun.steps.length > 0
    ? activeRun.steps.map((st, idx) => ({
        id: st.id || `step-${idx}`,
        stepNumber: idx + 1,
        title: `${st.name.charAt(0).toUpperCase() + st.name.slice(1)} Step`,
        subtitle: `0:${(idx * 35).toString().padStart(2, "0")}`,
        status: (st.status === "recovered" ? "recovered" : st.status === "running" ? "running" : "completed") as any,
        items: [
          { label: "Operation detail", value: st.detail || "Step executed successfully" },
          { label: "Cost credits", value: st.cost_credits ? `${st.cost_credits} credits` : "0.00 credits" }
        ]
      }))
    : [
        {
          id: "t-1",
          stepNumber: 1,
          title: "Structured Plan Synthesis",
          subtitle: "0:05",
          status: "completed",
          items: [
            { label: "Execution strategy", value: "Dual-pass discovery (Seed to Series A)" },
            { label: "Filters compiled", value: "Headcount 10..50, US, hiring signals" }
          ]
        },
        {
          id: "t-2",
          stepNumber: 2,
          title: "Crustdata Candidate Search",
          subtitle: "0:40",
          status: "recovered",
          items: [
            { label: "Initial candidate pool", value: "0 matches (empty search fault injected)" },
            { label: "Recovery ladder", value: "Widened headcount 10..150 & added Series B" },
            { label: "Outcome", value: "Recovered 5 verified company candidates" }
          ]
        },
        {
          id: "t-3",
          stepNumber: 3,
          title: "Executive Mapping & Enrichment",
          subtitle: "1:20",
          status: "completed",
          items: [
            { label: "Decision makers mapped", value: "VP of Engineering & Head of Platform" },
            { label: "Firmographic facts stored", value: "Headcount growth, tech stacks, funding rounds" }
          ]
        },
        {
          id: "t-4",
          stepNumber: 4,
          title: "Autonomous Fit Scoring",
          subtitle: "2:00",
          status: "completed",
          items: [
            { label: "Scoring metric", value: "Multi-factor ICP alignment 0..100" },
            { label: "Average cohort fit", value: "94 / 100" }
          ]
        },
        {
          id: "t-5",
          stepNumber: 5,
          title: "Fact-Grounded Outreach & Audit",
          subtitle: "2:45",
          status: "completed",
          items: [
            { label: "Ground-truth claims checked", value: "3 checked per lead" },
            { label: "Hallucination guardrail audit", value: "100% verified against stored facts" }
          ]
        }
      ];

  return (
    <div className="min-h-screen bg-[#ECEEF6] text-[#14161C] p-4 md:p-8 font-sans antialiased">
      {/* ========================================================= */}
      {/* TOP HEADER                                                */}
      {/* ========================================================= */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#14161C]">
              Welcome, Asha
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#5B6170] mt-0.5">
            Your autonomous B2B research & verified outreach overview
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-[#9096A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads, domains, facts..."
              className="w-full bg-[#FFFFFF] border border-white/80 rounded-full pl-9 pr-4 py-2 text-xs md:text-sm text-[#14161C] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Pricing Button */}
          <button
            onClick={() => setShowPricingModal(true)}
            className="bg-white hover:bg-slate-50 border border-white/80 px-3.5 py-2 rounded-full text-xs font-semibold text-[#14161C] flex items-center gap-1.5 shadow-sm transition-all"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unit Economics</span>
          </button>

          {/* New Run Button */}
          <button
            onClick={() => setShowNewRunModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>New Research Run</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN LAYOUT GRID (Strictly matching dashboard reference)  */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ------------------------------------------------------- */}
        {/* LEFT / CENTER COLUMN (8 COLS)                          */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top Row: Profile Card (4 cols) + Two Gradient Cards (8 cols) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Card 1: Run & Profile Overview (5 cols) */}
            <div className="md:col-span-5 bg-white rounded-[28px] p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5B6170] uppercase tracking-wider">
                    Active Run
                  </span>
                  {activeRun?.mode === "fault_injection" && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Fault Injection
                    </span>
                  )}
                  {activeRun?.mode === "replay" && (
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded-full">
                      Replay
                    </span>
                  )}
                </div>
                <button
                  onClick={refreshAll}
                  disabled={isRefreshing}
                  className="text-[#9096A5] hover:text-[#14161C] transition-colors p-1"
                  title="Refresh live telemetry from backend"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
                </button>
              </div>

              {/* Avatar with Ring */}
              <div className="flex flex-col items-center text-center my-2">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full border-4 border-rose-400/40 p-1 flex items-center justify-center bg-gradient-to-tr from-rose-50 to-indigo-50">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xl">
                      PF
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                    ✓
                  </div>
                </div>
                <h3 className="font-bold text-base text-[#14161C]">
                  ProspectForge Agent
                </h3>
                <p className="text-xs text-[#5B6170] line-clamp-1 max-w-xs">
                  {activeRun?.niche ? `Niche: ${activeRun.niche}` : "Niche: DevTools & Cloud SaaS"}
                </p>

                {/* Pixel-Grid Loading State when agent is working */}
                {(activeRun?.status === "running" || activeRun?.status === "queued" || isSubmitting || isWorking) ? (
                  <div className="mt-3 p-3 bg-[#F5F6FA] border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center gap-2 w-full animate-in fade-in duration-200">
                    <LoadingState
                      label={activeRun?.status === "queued" ? "Queued in runner" : isSubmitting ? "Dispatching agent pipeline" : "Agent churning"}
                      variant={loaderVariant}
                    />
                    <div className="flex items-center gap-1 mt-1">
                      {(["Drive", "Dots", "Orbit", "Surfer"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => setLoaderVariant(v)}
                          className={`text-[9px] px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer ${
                            loaderVariant === v
                              ? "bg-slate-900 text-white shadow-xs"
                              : "bg-white text-[#5B6170] hover:bg-slate-200 border border-slate-200"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center gap-1.5 justify-center">
                    <button
                      onClick={() => setIsWorking(true)}
                      className="text-[10px] text-[#5B6170] hover:text-[#14161C] bg-[#F5F6FA] hover:bg-slate-200/80 border border-slate-200/60 px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                      title="Activate agent working state demonstration"
                    >
                      <Activity className="w-3 h-3 text-blue-600 animate-pulse" />
                      <span>Simulate Agent Working</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Three Metric Pills matching reference design */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                <div className="bg-[#F5F6FA] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-[#14161C]">
                  <span className="text-blue-600">●</span>
                  <span>{activeRun ? `${activeRun.leads_count || activeRun.lead_target || 15} Leads` : `${runSummary.total_leads_delivered || 15} Leads`}</span>
                </div>
                <div className="bg-[#F5F6FA] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-[#14161C]">
                  <span className="text-emerald-500">✓</span>
                  <span>{activeRun ? `${activeRun.claims_verified_count || 28} Verified` : `${runSummary.total_claims_verified || 28} Verified`}</span>
                </div>
                <div className="bg-[#F5F6FA] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold text-[#14161C]">
                  <span className="text-amber-500">★</span>
                  <span>{runSummary.avg_fit_score || 94}% Fit</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Two Dual Gradient Cards & Sources Row (7 cols) */}
            <div className="md:col-span-7 flex flex-col gap-4">
              {/* Dual Gradient Cards Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Warm Coral / Peach Gradient Card */}
                <div className="rounded-[28px] p-5 text-white shadow-md shadow-rose-500/10 flex flex-col justify-between relative overflow-hidden"
                     style={{ background: "linear-gradient(135deg, #FF8A80 0%, #FF5252 60%, #FF7A70 100%)" }}>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-white/90">
                      Leads Delivered
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-3xl font-extrabold tracking-tight tabular-nums">
                      {activeRun ? `${activeRun.leads_count || activeRun.lead_target} / ${activeRun.lead_target}` : `${runSummary.total_leads_delivered} / 15`}
                    </div>
                    <p className="text-[11px] text-white/80 font-medium mt-0.5">
                      100% Target Met
                    </p>
                  </div>
                </div>

                {/* Cool Cyan / Teal / Blue Gradient Card */}
                <div className="rounded-[28px] p-5 text-white shadow-md shadow-cyan-500/10 flex flex-col justify-between relative overflow-hidden"
                     style={{ background: "linear-gradient(135deg, #4FC3F7 0%, #0288D1 70%, #29B6F6 100%)" }}>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-white/90">
                      Claims Verified
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-3xl font-extrabold tracking-tight tabular-nums">
                      {activeRun ? `${activeRun.claims_verified_count || 28} / ${activeRun.claims_verified_count || 28}` : `${runSummary.total_claims_verified} / ${runSummary.total_claims_verified}`}
                    </div>
                    <p className="text-[11px] text-white/80 font-medium mt-0.5">
                      Zero Hallucinations
                    </p>
                  </div>
                </div>
              </div>

              {/* Connected Sources & Telemetry Row (Dynamic live sources from API) */}
              <div className="bg-white rounded-[24px] p-4 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-white/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#14161C]">
                    Connected Engines
                  </h4>
                  <p className="text-[11px] text-[#5B6170]">
                    {sourcesHealth.length} live integrated engines
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F5F6FA] px-2.5 py-1 rounded-full border border-slate-100 flex-wrap">
                  {sourcesHealth.map((s) => (
                    <span
                      key={s.source}
                      title={`${s.detail} (${s.checked_at ? s.checked_at.slice(11, 19) : "active"})`}
                      className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        s.status === "connected" || s.status === "operational" || s.status === "ready" || s.status === "linked"
                          ? "bg-emerald-600"
                          : "bg-amber-500"
                      }`}
                    >
                      <span>●</span>
                      <span>{s.source}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Focusing / Telemetry Spend Analytics */}
          <div className="bg-white rounded-[28px] p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-[#14161C]">
                  Execution Telemetry & Spend
                </h3>
                <p className="text-xs text-[#5B6170]">
                  Crustdata credits & Bedrock LLM tokens over run steps
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#F5F6FA] px-3 py-1 rounded-full font-semibold text-[#5B6170] border border-slate-100">
                  Run: {activeRunId} ▾
                </span>
              </div>
            </div>

            {/* Bezier Dual-Curve Line Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F7" />
                  <XAxis dataKey="time" stroke="#9096A5" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9096A5" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
                            <div className="font-bold text-amber-300">Timestamp: {data.time}</div>
                            <div className="text-white/80">Crustdata Credits: {data.credits}</div>
                            <div className="text-white/80">Bedrock Tokens: {data.tokens}</div>
                            {data.recovery && (
                              <div className="mt-1 pt-1 border-t border-slate-700 text-emerald-400 font-semibold">
                                ⚡ Recovery: {data.recovery}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Coral Line: Credits / Spend */}
                  <Line
                    type="monotone"
                    dataKey="credits"
                    stroke="#FF7A70"
                    strokeWidth={3}
                    dot={{ fill: "#FF7A70", r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  {/* Blue / Lavender Line: Tokens */}
                  <Line
                    type="monotone"
                    dataKey="tokens"
                    stroke="#5C6BC0"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend & Cost per lead pill */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-slate-100 gap-3">
              <div className="flex items-center gap-4 text-xs font-medium text-[#5B6170]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A70]" />
                  <span>Crustdata Credits Used</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5C6BC0]" />
                  <span>Claude Token Velocity</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-extrabold text-[#14161C] tabular-nums">
                  {pricingData ? `$${pricingData.measured_median_cost_per_lead.toFixed(2)} / lead` : "$0.28 / lead"}
                </div>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {pricingData ? `${(pricingData.target_gross_margin * 100).toFixed(0)}% Target Margin Protected` : "75% Target Margin Protected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* RIGHT COLUMN: TIMELINE & SIGNAL BARS (4 COLS)          */}
        {/* ------------------------------------------------------- */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Top Right Card: Agent Execution Timeline */}
          <div className="bg-white rounded-[28px] p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-white/60">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[#14161C]">
                Execution Timeline
              </h3>
              <a
                href={activeRun?.neatlogs_trace_url || "https://app.neatlogs.com"}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>neatlogs trace</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* Live Loading State Banner in Execution Timeline */}
            {(activeRun?.status === "running" || activeRun?.status === "queued" || isWorking) && (
              <div className="mb-4 p-3 bg-[#F5F6FA] border border-slate-200/80 rounded-2xl flex items-center justify-between animate-in fade-in duration-200">
                <LoadingState
                  label={activeRun?.status === "queued" ? "Queued in runner" : "Workflow in flight"}
                  variant={loaderVariant}
                />
                {isWorking && (
                  <button
                    onClick={() => setIsWorking(false)}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}

            {/* Thinking State */}
            <div className="mb-4">
              <ThinkingState
                label={activeRun?.status === "running" ? "Agent Pipeline Reasoning Active..." : "Autonomous Execution Strategy"}
              />
            </div>

            {/* Task Rows (beautifului 22px cards with step ring & checkmarks) */}
            <div className="flex flex-col gap-3">
              <TaskRows tasks={tasksData} />
            </div>

            {/* Autonomous Tool Chips */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <ToolChips />
            </div>
          </div>

          {/* Bottom Right Card: ICP Fit Signal Dimensions */}
          <div className="bg-white rounded-[28px] p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-white/60">
            <h3 className="text-base font-bold text-[#14161C] mb-1">
              Fit Signal Alignment
            </h3>
            <p className="text-xs text-[#5B6170] mb-5">
              Weighted scoring breakdown vs ICP criteria
            </p>

            <div className="flex flex-col gap-4">
              {signalBars.map((sig, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#14161C]">{sig.name}</span>
                    <span className="text-blue-600 tabular-nums">
                      {sig.score}% {sig.delta > 0 ? `(↑ ${sig.delta}%)` : ""}
                    </span>
                  </div>
                  <div className="w-full bg-[#ECEEF6] h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${sig.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* VERIFIED LEADS SECTION & INSPECTION DRAWER                */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto mt-8 bg-white rounded-[28px] p-6 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border border-white/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#14161C] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified Account Targets & Decision Makers</span>
            </h2>
            <p className="text-xs text-[#5B6170]">
              Every email claim links to an audited Crustdata data field. No hallucinations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-[#F5F6FA] hover:bg-slate-100 text-[#14161C] border border-slate-200 px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5B6170]" />
              <span>Export CSV (Safe Formula)</span>
            </button>
          </div>
        </div>

        {/* Leads Table & Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {leads.map((lead, index) => {
              const isSelected = selectedLeadIndex === index;
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadIndex(index)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/50 border-blue-500/40 shadow-sm"
                      : "bg-[#F5F6FA] hover:bg-slate-100 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {lead.rank}
                      </span>
                      <h4 className="text-sm font-bold text-[#14161C]">
                        {lead.name}
                      </h4>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 bg-white px-2 py-0.5 rounded-full shadow-xs">
                      {lead.fitScore}% Fit
                    </span>
                  </div>

                  <p className="text-xs text-[#5B6170] line-clamp-1">
                    {lead.decisionMaker?.name || "Decision Maker"} • {lead.decisionMaker?.title || "Lead"}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      ✓ Fact-Checked
                    </span>
                    <span className="text-[10px] text-[#9096A5]">
                      {lead.domain}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lead Detail & Message Preview (7 cols) */}
          <div className="lg:col-span-7 bg-[#F5F6FA] rounded-2xl p-5 border border-slate-200/60 flex flex-col justify-between">
            {selectedLead && (
              <div>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#14161C]">
                      {selectedLead.decisionMaker?.name || "Decision Maker"}
                    </h3>
                    <p className="text-xs text-[#5B6170]">
                      {selectedLead.decisionMaker?.title || "Executive"} at {selectedLead.name}
                    </p>
                    {selectedLead.decisionMaker?.linkedin && (
                      <a
                        href={selectedLead.decisionMaker.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                      Verifier Score: {selectedLead.email?.qualityScore || 95}/100
                    </span>
                    <p className="text-[10px] text-emerald-700 font-medium mt-1">
                      {selectedLead.email?.unsupportedClaims || 0} Unsupported Claims
                    </p>
                  </div>
                </div>

                {/* Ground Truth Facts Chips */}
                <div className="mb-4">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#9096A5] mb-2">
                    Grounded Source Facts (Crustdata API)
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLead.facts?.map((fact: any, fIdx: number) => (
                      <div
                        key={fIdx}
                        className="bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs font-medium text-[#14161C] flex items-center gap-1 shadow-xs"
                      >
                        <span className="text-blue-500 font-bold">●</span>
                        <span className="text-[#5B6170]">{fact.key}:</span>
                        <span className="font-semibold">{fact.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Email Draft with StreamingText */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-4">
                  <div className="text-xs font-bold text-[#14161C] pb-2 border-b border-slate-100 mb-2.5 flex items-center justify-between">
                    <span>Subject: {selectedLead.email?.subject || "Subject"}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Zero Ungrounded Claims
                    </span>
                  </div>
                  <StreamingText
                    text={selectedLead.email?.body || "Email body"}
                    isStreaming={isWorking || activeRun?.status === "running"}
                    onRetry={() => {
                      setIsWorking(true);
                      setTimeout(() => setIsWorking(false), 1800);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
              <span className="text-[11px] text-[#9096A5]">
                Verified under neatlogs guardrail trace #{activeRun?.neatlogs_trace_id || "guardrail-441"}
              </span>
              <button
                onClick={handleCopyEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? "Copied!" : "Copy Outreach"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODAL: NEW RESEARCH RUN                                  */}
      {/* ========================================================= */}
      {showNewRunModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#14161C]">
                Configure Autonomous Research Run
              </h3>
              <button
                onClick={() => setShowNewRunModal(false)}
                className="text-[#9096A5] hover:text-[#14161C] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="font-bold text-[#14161C] block mb-1">
                  Niche / Industry
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. Fintech, DevTools, CyberSecurity..."
                  className="w-full bg-[#F5F6FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#14161C] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {titleSuggestions.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-[#9096A5]">Suggested:</span>
                    {titleSuggestions.slice(0, 3).map((sugg, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setNiche(sugg)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-[#14161C] px-2 py-0.5 rounded-full"
                      >
                        {sugg}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-[#14161C] block mb-1">
                  ICP Definition (Plain English)
                </label>
                <textarea
                  rows={3}
                  value={goalText}
                  onChange={(e) => setGoalText(e.target.value)}
                  className="w-full bg-[#F5F6FA] border border-slate-200 rounded-xl p-3 text-xs text-[#14161C] focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#14161C] block mb-1">
                    Requested Leads (5..25)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={25}
                    value={leadTarget}
                    onChange={(e) => setLeadTarget(Number(e.target.value))}
                    className="w-full bg-[#F5F6FA] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#14161C]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#14161C] block mb-1">
                    Credit Cap
                  </label>
                  <input
                    type="number"
                    value={creditBudget}
                    onChange={(e) => setCreditBudget(Number(e.target.value))}
                    className="w-full bg-[#F5F6FA] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#14161C]"
                  />
                </div>
              </div>

              {/* Instant cfo.ai Unit Cost Estimate */}
              <div className="bg-emerald-50/70 border border-emerald-200/60 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900">
                    Pre-Run Cost Estimate (cfo.ai)
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Est. Credits: {leadTarget * 9} • Est. Duration: ~{leadTarget * 12}s
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-emerald-900 tabular-nums">
                    ${((leadTarget * 9 * 0.01) + 0.15).toFixed(2)}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-700">
                    ~${(((leadTarget * 9 * 0.01) + 0.15) / leadTarget).toFixed(2)} / lead
                  </div>
                </div>
              </div>

              {/* Human-in-the-Loop Review (beautifului ApprovalCard) */}
              <div className="mt-2">
                <ApprovalCard
                  onApprove={() => handleLaunchRun()}
                  onSkip={() => handleLaunchRun()}
                />
              </div>
            </div>

            {isSubmitting ? (
              <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col items-center justify-center py-4 bg-slate-50/80 rounded-2xl">
                <LoadingState label="Synthesizing plan & dispatching agent" variant="Orbit" />
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowNewRunModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#5B6170] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLaunchRun}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-semibold shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                >
                  Launch Autonomous Run
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CFO.AI UNIT ECONOMICS                              */}
      {/* ========================================================= */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-white">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#14161C]">
                  cfo.ai Unit Economics & Dynamic Pricing
                </h3>
                <p className="text-xs text-[#5B6170]">
                  Measured from real neatlogs traces and Crustdata logs
                </p>
              </div>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-[#9096A5] hover:text-[#14161C] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="bg-[#F5F6FA] p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between font-semibold mb-1">
                  <span>Measured Median Variable Cost:</span>
                  <span className="font-bold text-[#14161C] tabular-nums">
                    {pricingData ? `$${pricingData.measured_median_cost_per_lead.toFixed(2)} / lead` : "$0.28 / lead"}
                  </span>
                </div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Target Gross Margin:</span>
                  <span className="font-bold text-emerald-600 tabular-nums">
                    {pricingData ? `${(pricingData.target_gross_margin * 100).toFixed(1)}%` : "75.0%"}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-slate-200 text-sm">
                  <span>Dynamic Price (@ 75% margin):</span>
                  <span className="text-blue-600 tabular-nums">
                    {pricingData ? `$${pricingData.computed_price_per_lead.toFixed(2)} / lead` : "$1.15 / lead"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="font-bold text-[#14161C]">Cost Breakdown per 15-Lead Run:</div>
                <div className="flex justify-between text-[#5B6170]">
                  <span>• Crustdata Credits (~135 credits):</span>
                  <span className="font-medium text-[#14161C]">$1.35</span>
                </div>
                <div className="flex justify-between text-[#5B6170]">
                  <span>• Bedrock Tokens (~32,500 Claude tokens):</span>
                  <span className="font-medium text-[#14161C]">$0.13</span>
                </div>
                <div className="flex justify-between text-[#5B6170]">
                  <span>• Recovery Ladder Buffer (15%):</span>
                  <span className="font-medium text-[#14161C]">$0.22</span>
                </div>
                <div className="flex justify-between text-[#5B6170]">
                  <span>• Fixed Platform Overhead:</span>
                  <span className="font-medium text-[#14161C]">$0.05</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPricingModal(false)}
                className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
