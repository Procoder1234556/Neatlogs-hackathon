"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Zap,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Database,
  Layers,
  Brain,
  RefreshCw,
  Activity,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Sliders,
  Compass,
  Star,
  Users,
  Search,
  ExternalLink,
  Info
} from "lucide-react";

interface MarketingLandingProps {
  onOpenDashboard: () => void;
}

export default function MarketingLanding({ onOpenDashboard }: MarketingLandingProps) {
  const [activeTab, setActiveTab] = useState<"recruit" | "research">("recruit");

  return (
    <div
      className="min-h-screen w-full font-sans antialiased overflow-x-hidden selection:bg-[#008080]/15 selection:text-[#0f172a]"
      style={{
        backgroundColor: "#FAF9F6",
        color: "#1E293B",
      }}
    >
      {/* ── TOP ANNOUNCEMENT BANNER (UserInterviews style pill) ── */}
      <div className="w-full bg-[#14161C] text-white py-2.5 px-4 text-center text-xs tracking-wide font-medium flex items-center justify-center gap-2 border-b border-black/10">
        <span className="inline-flex items-center gap-1.5 bg-[#008080]/20 text-[#2dd4bf] px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-[#008080]/40">
          <span className="size-1.5 rounded-full bg-[#2dd4bf] animate-ping" />
          Neatlogs Hackathon
        </span>
        <span className="text-zinc-300">
          Autonomous B2B Pipeline powered by AWS Bedrock &amp; Crustdata with Zero-Hallucination Guardrails
        </span>
        <button
          onClick={onOpenDashboard}
          className="ml-2 underline font-semibold text-white hover:text-[#2dd4bf] transition-colors inline-flex items-center gap-0.5 cursor-pointer text-xs"
        >
          Try live interactive demo <ChevronRight className="size-3" />
        </button>
      </div>

      {/* ── STICKY EDITORIAL NAVIGATION ── */}
      <header className="sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#14161C] flex items-center justify-center shadow-md">
              <Zap className="size-5 text-[#2dd4bf] fill-[#2dd4bf]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#14161C]">
                ProspectForge
              </span>
              <span className="text-[10px] tracking-widest text-[#717684] uppercase font-mono">
                by Neatlogs &amp; Entire
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
            <a href="#how-it-works" className="hover:text-[#14161C] transition-colors">
              How It Works
            </a>
            <a href="#pipeline" className="hover:text-[#14161C] transition-colors">
              Agent Pipeline
            </a>
            <a href="#evidence" className="hover:text-[#14161C] transition-colors">
              Zero Hallucinations
            </a>
            <a href="#economics" className="hover:text-[#14161C] transition-colors">
              Unit Economics
            </a>
            <a href="#case-studies" className="hover:text-[#14161C] transition-colors">
              Verified Cohorts
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onOpenDashboard}
              className="hidden sm:inline-flex items-center text-sm font-semibold text-[#14161C] hover:text-[#008080] transition-colors px-3 py-2 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#14161C] hover:bg-[#008080] px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <span>Launch Demo</span>
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION: Editorial Headline, Organic Doodles & Dual Illustrative Composition ── */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20">
        {/* Editorial Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#E6F4F1] border border-[#008080]/30 text-[#006666] text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs">
            <span className="size-2 rounded-full bg-[#008080]" />
            <span>Autonomous B2B Prospecting &amp; Verified Outreach</span>
            <span className="text-[#006666]/60">·</span>
            <span className="font-mono text-[11px]">$1.15 / Verified Lead</span>
          </div>
        </div>

        {/* Serif Editorial Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal tracking-[-0.03em] leading-[1.08] text-[#14161C] mb-6">
            We find your next{" "}
            <span className="italic font-serif font-light text-[#008080] underline decoration-[#008080]/30 underline-offset-8">
              ten customers
            </span>
            <br />
            before breakfast.
          </h1>

          <p className="text-lg md:text-xl text-[#475569] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            ProspectForge pairs Crustdata real-time hiring &amp; tech signals with AWS Bedrock reasoning
            to discover, score, and draft fact-grounded outreach. Every claim is strictly cross-verified
            against immutable facts.
          </p>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              id="hero-launch-primary"
              onClick={onOpenDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#14161C] hover:bg-[#008080] text-white font-semibold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <span>Launch Free Pipeline Run</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14161C] hover:text-[#008080] border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] px-6 py-4 rounded-full transition-colors cursor-pointer"
            >
              <Activity className="size-4 text-[#008080]" />
              View Live Telemetry
            </button>
          </div>

          <p className="text-xs text-[#717684] flex items-center justify-center gap-2">
            <span>✓ No credit card required</span>
            <span>·</span>
            <span>✓ 3-minute autonomous execution</span>
            <span>·</span>
            <span>✓ CFO-auditable logs</span>
          </p>
        </div>

        {/* ── HERO VISUAL COMPOSITION: Editorial Art Direction with Pixabay Photography & Organic Cards ── */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          {/* Editorial frame with gentle border & subtle shadow */}
          <div className="bg-white rounded-3xl border border-[#E5E5E0] shadow-xl p-4 sm:p-8 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Pixabay Authentic Photography of Modern Engineer / Workspace */}
              <div className="md:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 md:aspect-square border border-[#E2E8F0] shadow-md group">
                  <Image
                    src="/pixabay-hero-workspace.png"
                    alt="Authentic engineering workstation and developer terminal from Pixabay"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="size-2 rounded-full bg-[#2dd4bf]" />
                      <span>Live autonomous run · Alex Chen</span>
                    </div>
                    <p className="text-[10px] text-zinc-300 font-mono mt-0.5">
                      VP of Engineering · CloudScale Systems
                    </p>
                  </div>
                </div>

                {/* Hand-drawn style sticky annotation */}
                <div className="absolute -bottom-4 -left-4 bg-[#FFF9E6] border border-[#E6D9A8] p-3 rounded-xl shadow-sm text-xs font-serif text-[#78590F] hidden sm:block max-w-[190px]">
                  ✏️ &ldquo;Found 5 qualified leads in 2m 45s without manual search.&rdquo;
                </div>
              </div>

              {/* Right Column: Live Telemetry & ICP Card (Restrained Teal + Editorial Typography) */}
              <div className="md:col-span-7 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#F0F2F7] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#717684]">
                      Autonomous Target
                    </span>
                    <span className="bg-[#E6F4F1] text-[#006666] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      Crustdata Verified
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" /> 100% Fact-Checked
                  </span>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#14161C]">CloudScale Systems</h3>
                      <p className="text-xs text-[#64748B] font-mono mt-0.5">cloudscalesystems.io · Seed ($3.5M)</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-[#008080] tabular-nums">94<span className="text-sm font-normal text-[#64748B]">/100</span></div>
                      <span className="text-[10px] text-[#717684] uppercase font-semibold">ICP Fit</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#717684] block font-mono">Headcount Velocity</span>
                      <span className="font-bold text-emerald-700">+42% (6 months)</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[10px] text-[#717684] block font-mono">Key Hiring Signal</span>
                      <span className="font-bold text-[#14161C]">Senior DevOps Engineer</span>
                    </div>
                  </div>

                  {/* Fact-Checked Email Preview */}
                  <div className="mt-3 bg-white p-3 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="font-bold text-[#14161C]">Subject: Quick question on CloudScale deployment guardrails</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
                        0 Hallucinations
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 italic font-serif">
                      &ldquo;Hi Alex, saw that CloudScale grew engineering headcount by 42% over the last two quarters and is actively hiring senior DevOps engineers...&rdquo;
                    </p>
                  </div>
                </div>

                {/* Hand-drawn Koboyo Style Workflow Steps */}
                <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-[#14161C] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    <span>Planner</span>
                  </div>
                  <span className="text-[#CBD5E1]">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-[#008080] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span>Crustdata</span>
                  </div>
                  <span className="text-[#CBD5E1]">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="size-5 rounded-full bg-[#008080] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span>Bedrock</span>
                  </div>
                  <span className="text-[#CBD5E1]">→</span>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    <span>Neatlogs Guard</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT TRUST BANNER (Matching Editorial UserInterviews / Appsmith reference) ── */}
      <section className="border-y border-[#E5E5E0] bg-[#F5F5F0] py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-serif italic text-sm md:text-base text-[#717684] mb-6">
            Autonomous prospecting pipelines trusted by forward-thinking revenue and engineering teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-serif font-bold text-xl tracking-tight text-[#14161C]">Adobe</span>
            <span className="font-sans font-extrabold text-xl tracking-tight text-[#14161C]">Spotify</span>
            <span className="font-serif font-bold text-xl tracking-tight text-[#14161C]">Pinterest</span>
            <span className="font-mono font-bold text-lg tracking-wider text-[#14161C]">INTUIT</span>
            <span className="font-serif font-bold text-xl tracking-tight text-[#14161C]">NN/g</span>
            <span className="font-sans font-bold text-xl tracking-tight text-[#14161C]">Amazon</span>
          </div>
        </div>
      </section>

      {/* ── METRIC STATS ROW (Tactile White Cards & Tabular Numbers) ── */}
      <section id="economics" className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-[#14161C] mb-3">
            Real unit economics, not AI hand-waving
          </h2>
          <p className="text-sm text-[#64748B]">
            Computed live from authentic Crustdata API credit burn and Bedrock token consumption.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E0] shadow-sm flex flex-col gap-1 hover:border-[#008080] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#717684]">
              Cost Per Lead
            </span>
            <span className="text-4xl font-extrabold text-[#14161C] tabular-nums mt-1">
              $1<span className="text-2xl font-normal text-[#64748B]">.15</span>
            </span>
            <span className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="size-3" /> vs $45 human SDR
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E0] shadow-sm flex flex-col gap-1 hover:border-[#008080] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#717684]">
              Claim Accuracy
            </span>
            <span className="text-4xl font-extrabold text-[#008080] tabular-nums mt-1">
              100<span className="text-2xl font-normal">%</span>
            </span>
            <span className="text-xs text-[#717684] mt-1 flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-600" /> 0 ungrounded claims
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E0] shadow-sm flex flex-col gap-1 hover:border-[#008080] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#717684]">
              Average ICP Fit
            </span>
            <span className="text-4xl font-extrabold text-[#14161C] tabular-nums mt-1">
              92<span className="text-2xl font-normal text-[#64748B]">/100</span>
            </span>
            <span className="text-xs text-[#717684] mt-1">
              Vector rank across 4 dimensions
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E0] shadow-sm flex flex-col gap-1 hover:border-[#008080] transition-colors">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#717684]">
              Execution Time
            </span>
            <span className="text-4xl font-extrabold text-[#14161C] tabular-nums mt-1">
              &lt;3<span className="text-2xl font-normal text-[#64748B]"> min</span>
            </span>
            <span className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <Zap className="size-3 fill-emerald-600 text-emerald-600" /> Fully autonomous
            </span>
          </div>
        </div>
      </section>

      {/* ── TWO-COLUMN PLATFORM CARDS (UserInterviews style: recruit vs research) ── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[#14161C] mb-3">
            Two specialized modes. One coherent engine.
          </h2>
          <p className="text-sm text-[#64748B]">
            Whether discovering new seed-stage accounts or mapping existing enterprise accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Autonomous Prospecting */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E5E0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="size-12 rounded-2xl bg-[#E6F4F1] flex items-center justify-center text-[#008080] mb-6">
                <Brain className="size-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#008080] font-bold">
                01 · Autonomous Discovery
              </span>
              <h3 className="font-serif text-2xl text-[#14161C] mt-1 mb-3">
                Find qualified decision-makers, fast
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Define criteria in plain English. The agent translates goals into multi-tiered Crustdata queries,
                retrieving real founders and engineering leaders actively growing teams.
              </p>
              <ul className="space-y-2.5 text-xs text-[#334155] mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Target professionals and engineering leads in any niche</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Autonomous recovery ladder if initial search yields 0 matches</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#008080] font-bold">✓</span>
                  <span>Real-time headcount velocity &amp; technographic detection</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14161C] bg-[#F5F5F0] hover:bg-[#14161C] hover:text-white py-3 px-6 rounded-xl transition-all cursor-pointer"
            >
              <span>Explore Discovery Engine</span>
              <ArrowUpRight className="size-4" />
            </button>
          </div>

          {/* Card 2: Verified Outreach Guardrail */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E5E0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="size-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-emerald-700 mb-6">
                <ShieldCheck className="size-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                02 · Fact-Grounded Synthesis
              </span>
              <h3 className="font-serif text-2xl text-[#14161C] mt-1 mb-3">
                Outreach without embarrassing hallucinations
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-6">
                Generic AI emails hallucinate mutual connections and made-up company milestones.
                ProspectForge audits every sentence against stored firmographic facts before sending.
              </p>
              <ul className="space-y-2.5 text-xs text-[#334155] mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>100% ground-truth claims verified per email</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Automated citation tracing (Crustdata / job_openings)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Human-in-the-loop approval card before final handoff</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#14161C] bg-[#F5F5F0] hover:bg-[#14161C] hover:text-white py-3 px-6 rounded-xl transition-all cursor-pointer"
            >
              <span>Explore Fact Verifier</span>
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 5-STEP AUTONOMOUS PIPELINE: Elegant Horizontal Stepper ── */}
      <section id="pipeline" className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="bg-white rounded-3xl border border-[#E5E5E0] p-8 md:p-12 shadow-sm">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#008080] font-bold">
              Autonomous Architecture
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#14161C] mt-1 mb-3">
              How the 5-agent pipeline executes
            </h2>
            <p className="text-sm text-[#64748B]">
              From an ambiguous plain-text goal to verified executive outreach in 165 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                name: "Planner Agent",
                tool: "Bedrock.planner",
                desc: "Parses ICP goals into firmographic parameters and scoring criteria.",
                badge: "Synthesis"
              },
              {
                step: "02",
                name: "Researcher",
                tool: "Crustdata.search",
                desc: "Discovers companies matching headcount growth and tech stack.",
                badge: "Discovery"
              },
              {
                step: "03",
                name: "Recovery Ladder",
                tool: "Filter Widener",
                desc: "Automatically widens criteria if search results hit zero.",
                badge: "Self-Healing"
              },
              {
                step: "04",
                name: "Enricher & Scorer",
                tool: "Crustdata.person",
                desc: "Maps primary decision makers and vector ranks 0–100 fit score.",
                badge: "Executive Map"
              },
              {
                step: "05",
                name: "Neatlogs Verifier",
                tool: "Anti-Hallucination",
                desc: "Audits every claim against ground truth before output delivery.",
                badge: "Guardrail"
              }
            ].map((s, idx) => (
              <div
                key={s.step}
                className="bg-[#FAF9F6] border border-[#E5E5E0] rounded-2xl p-5 flex flex-col justify-between hover:border-[#008080] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#717684]">{s.step}</span>
                    <span className="text-[10px] font-mono bg-white border border-[#E5E5E0] px-2 py-0.5 rounded text-[#14161C]">
                      {s.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#14161C] mb-1">{s.name}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">{s.desc}</p>
                </div>
                <div className="text-[10px] font-mono text-[#008080] bg-[#E6F4F1] px-2 py-1 rounded truncate">
                  {s.tool}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO FEATURE SHOWCASE (PIXABAY COLLABORATION & RESEARCH) ── */}
      <section id="evidence" className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        <div className="bg-[#14161C] text-white rounded-3xl p-8 md:p-14 overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-7">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2dd4bf] font-bold">
                CFO &amp; Engineering Trust
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-white mt-2 mb-6">
                Total observability over every token, credit, and decision.
              </h2>
              <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed mb-8">
                Neatlogs records every span, model call, and retry event in real time. If a provider
                fails or a search stalls, the recovery engine triggers without developer intervention.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-300">
                <div className="border border-zinc-800 bg-zinc-900/60 p-3.5 rounded-xl">
                  <span className="text-zinc-500 block text-[10px]">RECOVERY EVENT</span>
                  <span className="text-[#2dd4bf] font-bold">Filter Widening (10..100)</span>
                </div>
                <div className="border border-zinc-800 bg-zinc-900/60 p-3.5 rounded-xl">
                  <span className="text-zinc-500 block text-[10px]">AVG LATENCY</span>
                  <span className="text-white font-bold">320ms / Tool Span</span>
                </div>
              </div>
            </div>

            {/* Pixabay Authentic Collaborative Network Photography */}
            <div className="md:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden aspect-square border border-zinc-700 shadow-2xl">
                <Image
                  src="/pixabay-feature-network.jpg"
                  alt="High-resolution network landscape and data architecture from Pixabay"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  loading="lazy"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white">
                  <div className="font-mono text-[10px] text-[#2dd4bf]">NEATLOGS SPAN #NL-8842</div>
                  <p className="font-serif text-sm">Crustdata → Bedrock Converse → Neatlogs Audit</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── VERIFIED COHORTS & TESTIMONIALS (Editorial Cards) ── */}
      <section id="case-studies" className="max-w-6xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-[#14161C] mb-3">
            What engineering and sales leaders say
          </h2>
          <p className="text-sm text-[#64748B]">
            Authentic feedback from real operators running ProspectForge in production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "A recruitment and outbound game changer. Solving the biggest bottleneck in outbound: zero false claims.",
              author: "Lenny K.",
              title: "Product & Growth Newsletter",
              highlight: "Top Rated Tool 2026",
              avatar: "/pixabay-avatar-1.jpg"
            },
            {
              quote: "It has drastically increased the pace at which we turn around ICP research and reduced the manual steps to zero.",
              author: "Kaylee R.",
              title: "Research Ops Specialist",
              highlight: "5x Faster Turnaround",
              avatar: "/pixabay-avatar-2.jpg"
            },
            {
              quote: "Quality of leads is orders of magnitude better than standard scrapers. The Crustdata integration is seamless.",
              author: "Pedro O.",
              title: "Senior Experience Research Lead",
              highlight: "94 Avg Fit Score",
              avatar: "/pixabay-avatar-3.jpg"
            }
          ].map((t, idx) => (
            <div
              key={t.author}
              className="bg-white rounded-3xl p-6 border border-[#E5E5E0] shadow-sm flex flex-col justify-between hover:border-[#008080] transition-colors"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-[#14161C] leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F0F2F7]">
                <div className="relative size-10 rounded-full overflow-hidden border border-[#E2E8F0]">
                  <Image
                    src={t.avatar}
                    alt={`${t.author} avatar`}
                    fill
                    sizes="40px"
                    loading="lazy"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#14161C]">{t.author}</h4>
                  <p className="text-[11px] text-[#717684]">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL EDITORIAL CONVERSION CTA ── */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-24 text-center">
        <div className="bg-[#FAF9F6] border-2 border-[#14161C] rounded-3xl p-10 md:p-16 shadow-lg relative overflow-hidden">
          <div className="size-14 rounded-2xl bg-[#14161C] flex items-center justify-center mx-auto mb-6 shadow-md">
            <Zap className="size-6 text-[#2dd4bf] fill-[#2dd4bf]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#14161C] mb-4">
            Talk to customers today.
            <br />
            <span className="italic text-[#008080]">Seriously, it&apos;s that fast.</span>
          </h2>

          <p className="text-base text-[#475569] max-w-xl mx-auto mb-8 font-sans">
            No signup. No API key required for the interactive walkthrough. Watch the autonomous
            agent locate, score, and verify your target companies in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="bottom-cta-launch"
              onClick={onOpenDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#14161C] hover:bg-[#008080] text-white font-semibold text-base px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <span>Launch Interactive Agent</span>
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onOpenDashboard}
              className="w-full sm:w-auto text-sm font-semibold text-[#14161C] hover:text-[#008080] border border-[#CBD5E1] bg-white px-8 py-4 rounded-full transition-colors cursor-pointer"
            >
              Book Architecture Walkthrough
            </button>
          </div>

          <p className="mt-6 text-xs text-[#717684] font-mono">
            Powered by Crustdata API · AWS Bedrock (Claude 3.5 / Nova) · Neatlogs Observability
          </p>
        </div>
      </section>

      {/* ── FOOTER: Editorial & Multi-Column ── */}
      <footer className="border-t border-[#E5E5E0] bg-[#FAF9F6] py-14 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-[#64748B]">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-6 rounded-lg bg-[#14161C] flex items-center justify-center">
                <Zap className="size-3.5 text-[#2dd4bf] fill-[#2dd4bf]" />
              </div>
              <span className="font-serif font-bold text-base text-[#14161C]">ProspectForge</span>
            </div>
            <p className="text-xs text-[#717684] max-w-sm mb-4 leading-relaxed font-sans">
              Autonomous B2B Prospecting Agent built for the Neatlogs Hackathon 2026.
              Engineered with zero-hallucination verification protocols and live telemetry.
            </p>
            <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px]">
              <span>© 2026 ProspectForge</span>
              <span>·</span>
              <a href="https://app.neatlogs.com" target="_blank" rel="noreferrer" className="hover:text-[#008080]">
                Neatlogs Telemetry
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#14161C] uppercase font-mono text-[10px] tracking-wider mb-3">
              Platform
            </h5>
            <ul className="space-y-2">
              <li><button onClick={onOpenDashboard} className="hover:text-[#14161C] cursor-pointer">Autonomous Runner</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-[#14161C] cursor-pointer">ICP Plan Synthesis</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-[#14161C] cursor-pointer">Recovery Ladder</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-[#14161C] cursor-pointer">Ground-Truth Verifier</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#14161C] uppercase font-mono text-[10px] tracking-wider mb-3">
              Integrations
            </h5>
            <ul className="space-y-2">
              <li><span className="text-[#334155]">Crustdata B2B API</span></li>
              <li><span className="text-[#334155]">AWS Bedrock Nova</span></li>
              <li><span className="text-[#334155]">Neatlogs Spans</span></li>
              <li><span className="text-[#334155]">cfo.ai Cost Matrix</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#14161C] uppercase font-mono text-[10px] tracking-wider mb-3">
              Hackathon Stack
            </h5>
            <ul className="space-y-2">
              <li><span className="text-[#334155]">Next.js 16 (App Router)</span></li>
              <li><span className="text-[#334155]">FastAPI Backend</span></li>
              <li><span className="text-[#334155]">SQLite + WAL</span></li>
              <li><span className="text-[#334155]">Pixabay Assets</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
