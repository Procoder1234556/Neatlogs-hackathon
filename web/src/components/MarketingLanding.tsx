"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Search,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  Globe,
  Sliders,
  DollarSign,
  Activity,
  Cpu,
  RefreshCw,
  Database
} from "lucide-react";

interface MarketingLandingProps {
  onOpenDashboard: () => void;
}

export default function MarketingLanding({ onOpenDashboard }: MarketingLandingProps) {
  const [selectedTag, setSelectedTag] = useState<"devops" | "founders" | "ai">("devops");

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#14161C] font-sans antialiased overflow-x-hidden selection:bg-[#0E5144]/20 selection:text-[#0E5144]">
      
      {/* ── 1. NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#ECEAE3]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Left: Logo + Primary Nav */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={onOpenDashboard}>
              <div className="size-8 rounded-full bg-[#0E5144] flex items-center justify-center text-white font-bold text-sm">
                PF
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-[#14161C] leading-none">
                  prospect forge
                </span>
                <span className="text-[9px] text-[#717684] tracking-widest uppercase font-mono mt-0.5">
                  by Neatlogs
                </span>
              </div>
            </div>

            {/* Dropdown Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#475569]">
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer" onClick={onOpenDashboard}>
                <span>Pipeline DAG</span>
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
              </div>
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer" onClick={onOpenDashboard}>
                <span>Claim Verifier</span>
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
              </div>
              <span className="hover:text-[#14161C] cursor-pointer" onClick={onOpenDashboard}>
                neatlogs Telemetry
              </span>
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer" onClick={onOpenDashboard}>
                <span>cfo.ai Economics</span>
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
              </div>
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer" onClick={onOpenDashboard}>
                <span>Crustdata API</span>
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
              </div>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenDashboard}
              className="text-sm font-semibold text-[#14161C] hover:text-[#0E5144] transition-colors cursor-pointer hidden sm:block"
            >
              Live Demo
            </button>
            <button
              id="nav-signup-free"
              onClick={onOpenDashboard}
              className="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Launch Pipeline →
            </button>
          </div>

        </div>
      </header>


      {/* ── 2. HERO: With Doodles & Floating Verified ICP Personas ── */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-20">
        
        {/* Top pill link */}
        <div className="flex justify-center mb-6">
          <button
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-2 bg-white border border-[#E2DFD7] text-xs text-[#475569] font-medium px-4 py-1.5 rounded-full shadow-xs hover:border-[#0E5144] transition-colors cursor-pointer"
          >
            <span className="size-2 rounded-full bg-[#0E5144]" />
            <span className="text-[#14161C] font-semibold">Zero-Hallucination Outbound:</span>
            <span>Every assertion verified against live Crustdata entities.</span>
            <span className="underline text-[#0E5144] font-semibold">View Live DAG →</span>
          </button>
        </div>

        {/* Center Headline */}
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[76px] font-normal tracking-[-0.03em] leading-[1.05] text-[#14161C] mb-6">
            Autonomous B2B
            <br />
            outreach that never
            <br />
            hallucinates
          </h1>
          <p className="text-base sm:text-lg text-[#555C68] max-w-xl mx-auto mb-8 font-normal leading-relaxed">
            Eliminate generic spam and invented claims. ProspectForge discovers decision-makers, cross-audits every drafted assertion against live B2B facts, and auto-heals empty queries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="hero-signup-free"
              onClick={onOpenDashboard}
              className="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-base font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Launch Autonomous Run
            </button>
            <button
              onClick={onOpenDashboard}
              className="bg-white hover:bg-[#F4F4F0] text-[#14161C] border border-[#D5D2C8] text-base font-semibold px-7 py-3.5 rounded-full transition-all cursor-pointer shadow-xs"
            >
              View neatlogs Traces
            </button>
          </div>
        </div>

        {/* ── KOBYOYO DOODLES & FLOATING VERIFIED PROSPECT AVATARS ── */}
        
        {/* ── LEFT SIDE: Combined Double-SVG Illustrations with controlled size & gap ── */}
        <div className="hidden md:flex flex-col gap-6 lg:gap-8 absolute top-8 left-4 lg:left-8 max-w-[240px] z-10">
          
          {/* SVG 1: Accountant Laptop Illustration */}
          <div className="relative group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              aria-label="accountant laptop"
              viewBox="0 0 227 233"
              className="w-40 h-40 lg:w-48 lg:h-48 text-[#14161C] transition-transform duration-300 hover:scale-105"
            >
              <path d="M83.1 12.6a50 50 0 0 0-34.9 35.1C47 51.4 44.9 61 43.5 69a103 103 0 0 1-6.7 24c-5.1 12.1-5.6 20-1.7 27l2.4 4.5-5.6 5.5c-3.1 3-6.8 7.8-8.2 10.5-6 12-12.8 41-13 55.5-.2 10.3 1.7 14.9 7.6 18.8 3.9 2.6 4.6 2.7 17.1 2.7 9.4 0 14.9-.5 19.5-1.8 5.8-1.6 6.5-1.6 7.5-.1 1 1.3 6.2 2.1 24.2 4a221 221 0 0 0 46.9 1.4c45.3-2 59.6-3 61.5-4s3.3-4 2.8-5.6a95 95 0 0 0 6.1-19.9l7.6-34c5.3-23 5.5-24.7 2.9-27.6-1.9-2.2-1.9-2.2-41.4-1.5l-39.5.7-2.4-2.5c-1.4-1.4-1.9-2.6-1.3-2.6 2.1 0 6.3-8.8 6.9-14.2a60 60 0 0 0-1-13.3 40 40 0 0 1-.5-14.5 110 110 0 0 0 1.2-11.5 44 44 0 0 1 1.9-10.4 37 37 0 0 0-6-34c-5.1-6-9.5-8.5-21.3-12a46 46 0 0 0-27.9-1.5M121.3 37c5.6 5 9.6 12.9 10.4 20.5l.6 5.7-3.1-1.6c-1.7-.9-4.1-1.6-5.4-1.6-3.2 0-8.6 3.5-10 6.5q-1 2.6-4 2.5-2.6 0-2.8-1.3c0-.7-1.3-2.6-2.9-4.1-5.5-5.2-14-4.3-19 2-1.9 2.4-2.5 2.6-6.5 2l-4.4-.7 2.2-5.5 2.1-5.6 7-2.2c10.1-3.2 18.6-8 24.4-13.9 2.8-2.8 5.1-5.5 5.1-5.9 0-1.6 1.8-.7 6.3 3.2M99.1 64c.5 0 1.8.9 2.9 2 2.9 2.9 2.7 9.4-.5 12.5C96 84.1 87 80.1 87 72.2c0-5.3 5.2-9.9 9.8-8.6zm30.8 2.6q4.2 5.6-.5 11.3c-3.3 3.9-7.4 4.1-10.9.6a9 9 0 0 1-.3-12.2c3.1-3.3 9-3.2 11.7.3m-63.8 3.5c2.5 2.7 3.1 3 4.6 1.8a5 5 0 0 1 3.7-1.1c7.9 1 8.4 1.2 9.1 4.2.4 1.7 2 4.3 3.5 5.9 6.2 6.2 15.7 4.4 19.5-3.7 2.7-5.8 4-5.9 6-.4 2.6 7.3 2.4 8.6-.9 9.2s-4.6 2.7-2.2 3.6 7.6-1.6 8.2-4c.4-1.8 1.1-2.1 4.8-1.8 2.4.2 5.3-.1 6.5-.7 1.8-1 2.1-.9 2.1.8 0 3.6-4 14.6-6.8 18.6a35 35 0 0 1-7.5 7.2c-6.3 4.2-12.3 5.1-20.7 2.9-7.8-2-8-2-8-.3s3.8 3.5 9 4.3c3.6.6 4 .9 4 3.6q0 3.3 1.5 2.4c2.1-.8 1.9 1.7-.5 4.7-2.7 3.4-8 5-14.9 4.5q-11.1-.9-15.8-7.9l-2.6-3.9 2.2-1.7c1.6-1.3 2.5-3.7 3.3-8.9 1.1-6.8 1-7.1-1.5-11a24 24 0 0 1-3.3-7.2c-.6-2.7-1.1-3.2-3.6-3.2-4.4 0-6.8-1.7-8.9-6.6-2.4-5.3-1.7-10.7 1.4-12.9s4.6-1.9 7.8 1.6m.9 53.8c6.4 12.7 27 16.2 37.2 6.4 1.5-1.4 3-3.9 3.3-5.4.4-1.6.9-2.9 1.2-2.9a89 89 0 0 1 15.5 4.6c3 1.6 3.7 3.4 1.3 3.4-2.9 0-4.5 4.9-11 34.5-7.8 35.3-7.3 33.6-8.7 31a39 39 0 0 0-12.3-11.8c-5.9-3.1-15.2-2.8-23 .7A25 25 0 0 1 56 187c-4.6 0-8.5-.2-8.6-.3-.2-.1.8-6.1 2.2-13.2l2.4-13.3q-.1-.2-1.9-.2c-1.5 0-2.2 1.7-4 11.3l-2.6 13.4c-.5 2-1.2 2.3-4.9 2.3-2.6 0-4.8.6-5.6 1.5-1.9 2.3.3 2.7 12.7 2.3l11-.3-1.8 4a14 14 0 0 0-.4 13.2l1.5 3.8c0 .9-14 2.5-21.6 2.5-10 0-14.3-1.5-17.8-6.3-3.8-5.1-2.2-23.5 4-46.7 6.7-24.8 14.2-33 35.4-38.6l8.7-2.3c.2-.1 1.2 1.7 2.3 3.8m144.9 8.5c.8 1-.9 10.1-7.2 37.4a908 908 0 0 1-8.9 36.7c-.3.3-15.1 1.2-32.9 2l-43.1 2c-10.8.6-10.8.6-10.8-1.7 0-4.4 16-73.2 17.2-74.4 1-1 11.7-1.5 41.8-2.2l41.6-1c.6-.1 1.7.4 2.3 1.2M90.7 186.5c4.5 1.9 6.7 3.8 10.4 8.9 2.8 3.8 3.9 8.6 1.9 8.6-.5 0-2.3-2-3.9-4.4-3.1-4.5-8.6-8.6-11.5-8.6-2.6 0-1.9 1.8 1.4 3.5s9 8.9 9 11.2q-.1 4.1-8.8-4.7c-5.5-5.6-9.2-7.6-9.2-4.8 0 .7 1.6 2.3 3.5 3.5 4.5 3 7.2 7 5.7 8.5-.9.9-2.1.4-4.9-1.9-5.6-4.4-7.5-4.8-10.7-1.8-2.7 2.5-3.5 2.7-11.3 3-3.4.1-4.2-.2-4.7-1.9-1.5-5.6.8-13.6 4-13.6.8 0 2.9-.7 4.7-1.7q15-7.7 24.4-3.8M79.5 207q.4 1-2.2 1-3.2.1-1.3-1c1.9-1.2 2.7-1.2 3.5 0m25.2 2.6c-.3.3-1.6.4-2.9.2l-2.3-.5 2.5-1c2.3-1 4.1-.1 2.7 1.3M86.3 212c17.5 1.5 18.6 1.7 18 3.8-.4 1.6-1.4 1.6-19.6-.2a278 278 0 0 1-19.7-2.3c-1-.9 2.6-2.3 5.8-2.3 1.9 0 8.8.5 15.5 1m107.2 0c.3.5-.4 1.4-1.7 1.9-1.8.8-70.4 4.2-81.5 4.1-3 0-3-2.8 0-3.4 1.7-.4 48.5-2.4 78.4-3.5 2.3 0 4.5.3 4.8.9"/>
              <path d="M90.2 55.5c-2.9 2.1-1.8 3.9 1.7 2.9 1.4-.4 3.9-.6 5.4-.5q3.1.3 2.5-1.6c-.4-2.4-6.5-2.9-9.6-.8m28.8 0q.1 1.4 2.6 1.5c1.4 0 3.4.5 4.4 1 2.6 1.4 3.9-.9 1.5-2.7-2.6-1.8-8.5-1.7-8.5.2M94.1 68.4c-.7.8-1.1 2.7-.9 4.3.2 2.2.8 2.8 2.8 2.8s2.6-.6 2.8-2.8C99.1 70 97.6 67 96 67q-.8.1-1.9 1.4m26.9.1c-1.6 2-.8 6.9 1.2 7.3.9.2 2.1-.5 2.7-1.6 2-3.8-1.3-8.8-3.9-5.7M97.2 94.8q-3 1 2.1 4.2c3.3 2.1 9.2 2.6 11.6 1.1 2.3-1.5.2-3.3-3-2.6a8 8 0 0 1-6.2-1.2c-1.8-1.1-3.8-1.8-4.5-1.5m60.6 70.9c-5 5.3-4.5 11.9 1.1 14.8q5.8 3 10.6-2.7c7.5-8.9-3.7-20.5-11.7-12.1m9.7 2.7c2.4 3.7-.7 9.6-5.1 9.6-4.6 0-5.7-5.8-1.9-9.5 3-3.1 5-3.2 7-.1"/>
            </svg>
            
            <div className="absolute top-2 right-2 size-14 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src="/pixabay-avatar-1.jpg"
                alt="Alex - DevOps Lead"
                fill
                sizes="56px"
                priority
                className="object-cover"
              />
            </div>
            
            <div className="absolute -bottom-2 -left-2 bg-white border border-[#E5E5E0] px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#14161C] flex items-center gap-1.5 whitespace-nowrap">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Alex · VP Infra (98% Fit Score)</span>
            </div>
          </div>

          {/* SVG 2: Integrations Stack & Telemetry Doodle */}
          <div className="relative group pl-6">
            <svg
              className="w-36 h-32 lg:w-40 lg:h-36 text-[#14161C]"
              viewBox="0 0 160 140"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="20" y="40" width="35" height="35" rx="8" strokeWidth="1.5" />
              <circle cx="95" cy="55" r="16" strokeWidth="1.5" />
              <path d="M 40,85 C 60,110 100,105 120,80" strokeDasharray="4 4" />
            </svg>
            <div className="absolute top-2 left-6 size-14 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src="/pixabay-avatar-3.jpg"
                alt="Growth Ops Lead"
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 left-2 bg-white border border-[#E5E5E0] px-2.5 py-0.5 rounded-full shadow-xs text-[10px] font-mono font-bold text-[#0E5144]">
              neatlogs: 200 OK
            </div>
          </div>

        </div>

        {/* Top Right: Workspace Folder Doodle + Verified Lead */}
        <div className="hidden md:block absolute top-10 right-6 lg:right-12 max-w-[240px]">
          <div className="relative">
            <svg className="w-56 h-48 text-[#14161C]" viewBox="0 0 200 180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 40,70 L 70,70 L 85,85 L 160,85 L 160,150 L 40,150 Z" />
              <path d="M 50,50 L 90,30 L 130,50" opacity="0.4" />
              <path d="M 140,20 C 160,15 175,30 180,50" strokeWidth="1.5" />
            </svg>

            <div className="absolute top-6 left-12 size-18 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <Image
                src="/pixabay-avatar-2.jpg"
                alt="Elena - VP Engineering"
                fill
                sizes="72px"
                priority
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-6 right-0 bg-white border border-[#E5E5E0] px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#14161C] flex items-center gap-1.5 whitespace-nowrap">
              <span className="size-2 rounded-full bg-[#0E5144]" />
              <span>Elena · Crustdata Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Laptop Doodle */}
        <div className="hidden lg:block absolute bottom-4 right-16 max-w-[200px]">
          <div className="relative">
            <svg className="w-48 h-40 text-[#14161C]" viewBox="0 0 180 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 40,70 L 140,70 L 120,110 L 20,110 Z" />
              <path d="M 40,70 L 40,40 L 140,40 L 140,70" />
              <circle cx="90" cy="55" r="5" fill="currentColor" />
            </svg>
            <div className="absolute top-4 left-10 size-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src="/pixabay-avatar-4.jpg"
                alt="Product Lead"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-2 bg-white border border-[#E5E5E0] px-2.5 py-0.5 rounded-full shadow-xs text-[10px] font-mono font-bold text-[#14161C]">
              Cost: $0.089 / lead
            </div>
          </div>
        </div>

      </section>


      {/* ── 3. TECH STACK & INTEGRATIONS BAR ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-5">
          <p className="font-serif italic text-lg sm:text-xl text-[#14161C]">
            Engineered with enterprise observability and verified B2B intelligence
          </p>
        </div>

        {/* Triple-dot header detail card */}
        <div className="bg-white rounded-2xl border-2 border-[#14161C] p-6 shadow-xs relative">
          <div className="absolute -top-3 left-6 bg-white px-2 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-[#14161C]" />
            <span className="size-1.5 rounded-full bg-[#14161C]" />
            <span className="size-1.5 rounded-full bg-[#14161C]" />
          </div>

          <div className="flex flex-wrap items-center justify-around gap-8 text-[#14161C]">
            <span className="font-serif font-bold text-2xl tracking-tight">Crustdata</span>
            <span className="font-mono font-extrabold text-2xl tracking-tight text-[#0E5144]">neatlogs</span>
            <span className="font-sans font-bold text-2xl tracking-tight">AWS Bedrock</span>
            <span className="font-mono font-bold text-xl tracking-wider text-emerald-700">cfo.ai</span>
            <span className="font-serif font-bold text-2xl tracking-tight">FastAPI</span>
            <span className="font-sans font-extrabold text-2xl tracking-tight">Next.js 15</span>
          </div>
        </div>
      </section>


      {/* ── 4. TWO-PILLAR PLATFORM SECTION: Autonomous Discovery vs Claim Verification ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Title & Filter Pills */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#14161C] mb-4">
            The dual-engine outbound architecture
          </h2>
          <p className="text-sm text-[#555C68] mb-6">
            Live entity intelligence on one side. Autonomous anti-hallucination verification on the other.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#EEECE4] p-1 rounded-full text-xs font-semibold">
            <span className="text-[#717684] px-3">Target ICP</span>
            <button
              onClick={() => setSelectedTag("devops")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedTag === "devops" ? "bg-[#14161C] text-white shadow-xs" : "text-[#555C68] hover:text-[#14161C]"
              }`}
            >
              DevOps &amp; Infra
            </button>
            <button
              onClick={() => setSelectedTag("founders")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedTag === "founders" ? "bg-[#14161C] text-white shadow-xs" : "text-[#555C68] hover:text-[#14161C]"
              }`}
            >
              Series A Founders
            </button>
            <button
              onClick={() => setSelectedTag("ai")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedTag === "ai" ? "bg-[#14161C] text-white shadow-xs" : "text-[#555C68] hover:text-[#14161C]"
              }`}
            >
              Applied AI Teams
            </button>
          </div>
        </div>

        {/* Dual Cards: Discovery vs Verification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card Left: Researcher & Enricher */}
          <div className="bg-[#F0F7F5] rounded-3xl p-8 border border-[#D5E6E1] flex flex-col justify-between shadow-xs">
            <div>
              <div className="bg-white rounded-2xl p-5 border border-[#E0ECE8] shadow-sm mb-8 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] mb-4 text-xs font-semibold text-[#14161C]">
                  <span>Crustdata Search &amp; Fit Scoring</span>
                  <span className="text-[#0E5144] font-mono text-[11px]">+94% Fit Score</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#717684] uppercase font-mono block mb-1.5">Company Filters</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-[#F4F4F0] px-2.5 py-1 rounded-md text-[#14161C] font-medium text-[11px]">Series A / B ✕</span>
                      <span className="bg-[#F4F4F0] px-2.5 py-1 rounded-md text-[#14161C] font-medium text-[11px]">50-250 Headcount ✕</span>
                      <span className="bg-[#F4F4F0] px-2.5 py-1 rounded-md text-[#14161C] font-medium text-[11px]">Kubernetes Stack ✕</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#717684] uppercase font-mono block mb-1.5">Identified Decision Makers</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-[#E6F3EF] text-[#0E5144] font-bold px-2.5 py-1 rounded-md text-[11px]">VP of Engineering ✕</span>
                      <span className="bg-[#E6F3EF] text-[#0E5144] font-bold px-2.5 py-1 rounded-md text-[11px]">Head of Platform ✕</span>
                    </div>
                  </div>

                  <div className="absolute right-4 top-10 flex flex-col gap-1.5">
                    <div className="size-8 rounded-full overflow-hidden border border-white shadow-sm relative">
                      <Image src="/pixabay-avatar-1.jpg" alt="Enriched lead" fill sizes="32px" className="object-cover" />
                    </div>
                    <div className="size-8 rounded-full overflow-hidden border border-white shadow-sm relative">
                      <Image src="/pixabay-avatar-2.jpg" alt="Enriched lead" fill sizes="32px" className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="size-2 rounded-full bg-[#0E5144]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#0E5144] font-bold">
                  STAGE 1-3 | DEEP RESEARCH &amp; SCORING
                </span>
              </div>

              <h3 className="font-serif text-3xl text-[#14161C] mb-4 leading-tight">
                Live B2B intelligence &amp; self-healing
              </h3>

              <ul className="space-y-2 text-sm text-[#475569] mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Direct Crustdata API integration for headcounts, funding &amp; titles</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Self-healing recovery controller automatically widens search on zero hits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Exponential backoff handling for 429 rate limits without workflow failure</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenDashboard}
              className="w-fit bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Inspect Research Agent
            </button>
          </div>

          {/* Card Right: Fact-Grounded Writer & Claim Verifier */}
          <div className="bg-[#F0F7F5] rounded-3xl p-8 border border-[#D5E6E1] flex flex-col justify-between shadow-xs">
            <div>
              <div className="bg-white rounded-2xl p-5 border border-[#E0ECE8] shadow-sm mb-8 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] mb-4 text-xs font-semibold text-[#14161C]">
                  <span>Claim Verification Audit</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="bg-[#E6F3EF] text-[#0E5144] px-2 py-0.5 rounded font-bold">100% Verified</span>
                    <span className="text-[#717684]">0 Hallucinations</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EBE8DC]">
                    <span className="font-medium text-[#14161C]">&ldquo;Scaled infra team to 35 engineers&rdquo;</span>
                    <span className="font-mono text-[11px] text-[#0E5144] font-bold">✓ Grounded</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EBE8DC]">
                    <span className="font-medium text-[#14161C]">&ldquo;Closed $14M Series A in March&rdquo;</span>
                    <span className="font-mono text-[11px] text-[#0E5144] font-bold">✓ Grounded</span>
                  </div>
                </div>

                <div className="absolute top-2 right-2 text-[#0E5144] opacity-80">
                  <svg className="size-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M 20,5 L 20,35 M 5,20 L 35,20 M 9,9 L 31,31 M 9,31 L 31,9" />
                  </svg>
                </div>
              </div>

              {/* Tag Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="size-2 rounded-full bg-[#14161C]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#14161C] font-bold">
                  STAGE 4-5 | GUARDRAIL &amp; REWRITE LOOP
                </span>
              </div>

              <h3 className="font-serif text-3xl text-[#14161C] mb-4 leading-tight">
                Anti-hallucination sentence audit
              </h3>

              <ul className="space-y-2 text-sm text-[#475569] mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Bedrock Claude 3.5 Sonnet drafts hyper-personalized copy</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Claim Verifier checks every assertion against stored entity facts</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Ungrounded claims automatically trigger targeted rewrite loops</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenDashboard}
              className="w-fit bg-[#14161C] hover:bg-black text-white text-sm font-semibold px-6 py-3 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Inspect Verifier Engine
            </button>
          </div>

        </div>

        {/* ── 5. STATS BANNER: Real verified pipeline metrics ── */}
        <div className="mt-12 bg-white rounded-2xl border-2 border-[#14161C] p-6 shadow-xs relative">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden sm:block text-[#14161C]">
            <Award className="size-8 stroke-[1.5]" />
          </div>

          <div className="text-center font-mono text-xs sm:text-sm tracking-wider uppercase text-[#14161C] sm:px-16 leading-relaxed">
            <span className="font-bold text-[#0E5144]">0% HALLUCINATIONS</span> audited &nbsp;|&nbsp;
            <span className="font-bold text-[#0E5144]">100% FACT-GROUNDED</span> claims &nbsp;|&nbsp;
            <span className="font-bold">&lt;$0.09</span> cost per lead
            <br className="hidden md:block" />
            <span className="font-bold">&gt;70% GROSS MARGIN</span> protected &nbsp;|&nbsp;
            <span className="font-bold">429 RATE-LIMIT</span> self-healing &nbsp;|&nbsp;
            <span className="font-bold text-[#0E5144]">NEATLOGS</span> distributed telemetry
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:block text-[#14161C]">
            <Sparkles className="size-8 stroke-[1.5]" />
          </div>
        </div>

      </section>


      {/* ── 6. "HOW IT WORKS" 3-STEP PIPELINE EXECUTION ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading + Koboyo Doodle */}
          <div className="md:col-span-5">
            <h3 className="font-serif text-4xl sm:text-5xl text-[#14161C] mb-2 leading-tight">
              Autonomous DAG execution
            </h3>
            <span className="text-xs font-mono uppercase tracking-widest text-[#717684] block mb-8 font-bold">
              SEE HOW IT RUNS IN REAL TIME
            </span>

            {/* Koboyo Doodle Running Characters SVG */}
            <div className="text-[#14161C]">
              <svg className="w-48 h-36" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="40" cy="35" r="14" />
                <path d="M 40,50 L 40,85 M 40,65 L 20,55 M 40,65 L 60,60" />
                <path d="M 40,85 L 25,115 M 40,85 L 55,110" />
                <circle cx="95" cy="40" r="14" />
                <path d="M 95,55 L 95,90 M 95,70 L 75,65 M 95,70 L 115,75" />
                <path d="M 95,90 L 80,118 M 95,90 L 110,115" />
                <path d="M 125,45 L 145,35 L 145,65 L 125,55 Z" strokeWidth="1.5" />
                <path d="M 125,45 L 125,100" />
              </svg>
            </div>
          </div>

          {/* Right Column: 3 Stepper Rows */}
          <div className="md:col-span-7 divide-y divide-[#E5E5E0]">
            
            {/* Step 1 */}
            <div className="py-6 flex items-start gap-6">
              <div className="pt-1">
                <span className="font-mono text-xs text-[#0E5144] uppercase tracking-wider block font-bold">
                  STEP 1:
                </span>
              </div>
              <div>
                <h4 className="font-medium text-base text-[#14161C] mb-1">
                  Plain-English intake &amp; structured planning
                </h4>
                <p className="text-sm text-[#64748B]">
                  Planner translates your target criteria and budget into structured search queries and fallback widening ladders.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="py-6 flex items-start gap-6">
              <div className="pt-1">
                <span className="font-mono text-xs text-[#0E5144] uppercase tracking-wider block font-bold">
                  STEP 2:
                </span>
              </div>
              <div>
                <h4 className="font-medium text-base text-[#14161C] mb-1">
                  Live Crustdata enrichment &amp; fit scoring
                </h4>
                <p className="text-sm text-[#64748B]">
                  Extracts live company headcount trajectories, funding rounds, and verified decision-makers, ranking candidates with transparent fit scores.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="py-6 flex items-start gap-6">
              <div className="pt-1">
                <span className="font-mono text-xs text-[#0E5144] uppercase tracking-wider block font-bold">
                  STEP 3:
                </span>
              </div>
              <div>
                <h4 className="font-medium text-base text-[#14161C] mb-1">
                  Fact verification, neatlogs tracing &amp; SSE streaming
                </h4>
                <p className="text-sm text-[#64748B]">
                  Claim Verifier validates every assertion before output. Live progress streams to your dashboard via SSE and neatlogs distributed spans.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onOpenDashboard}
                className="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold px-7 py-3 rounded-full transition-all cursor-pointer shadow-xs"
              >
                Run Pipeline Demo →
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ── 7. DEEP MAROON BANNER: CFO.AI UNIT ECONOMICS ── */}
      <section className="w-full bg-[#5C1B33] text-white py-16 px-6 lg:px-12 my-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Koboyo Doodle with Money / Profit Metric */}
          <div className="md:col-span-5 flex justify-center md:justify-start">
            <svg className="w-64 h-56 text-white" viewBox="0 0 200 180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="100" cy="50" r="20" strokeWidth="2" />
              <path d="M 100,72 L 100,130" strokeWidth="3" />
              <path d="M 100,85 L 60,40 M 60,40 L 40,30" strokeWidth="3" />
              <path d="M 100,85 L 140,40 M 140,40 L 160,30" strokeWidth="3" />
              <circle cx="35" cy="55" r="14" strokeWidth="1.5" />
              <text x="31" y="60" fill="currentColor" fontSize="14" fontWeight="bold">$</text>
              <rect x="145" y="65" width="22" height="22" rx="4" strokeWidth="1.5" />
              <path d="M 156,65 L 156,87 M 145,76 L 167,76" />
            </svg>
          </div>

          {/* Right: Copy & Button */}
          <div className="md:col-span-7">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white mb-4 leading-tight">
              Real-time unit economics powered by cfo.ai
            </h3>
            <p className="text-white/80 text-sm sm:text-base mb-8 font-light leading-relaxed">
              Never get surprised by runaway LLM and API costs. ProspectForge meters Crustdata credits and Bedrock tokens down to the cent, enforcing target <span className="font-bold text-white">&gt;70% gross margins</span> on every outbound campaign.
            </p>
            <button
              onClick={onOpenDashboard}
              className="bg-transparent hover:bg-white/10 text-white font-semibold text-sm border-2 border-white px-8 py-3 rounded-full transition-colors cursor-pointer"
            >
              Inspect Economics Dashboard
            </button>
          </div>

        </div>
      </section>


      {/* ── 8. TESTIMONIALS & RELIABILITY BADGES ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header with Title + 3 Badges */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#14161C] max-w-md leading-tight">
            Built for operators who value accuracy over spam
          </h2>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#E5E5E0] rounded-xl px-4 py-2.5 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 block font-bold">100% Fact</span>
              <span className="font-bold text-xs text-[#14161C]">Verified</span>
            </div>
            <div className="bg-white border border-[#E5E5E0] rounded-xl px-4 py-2.5 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0E5144] block font-bold">neatlogs</span>
              <span className="font-bold text-xs text-[#14161C]">Observable</span>
            </div>
            <div className="bg-white border border-[#E5E5E0] rounded-xl px-4 py-2.5 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block font-bold">cfo.ai</span>
              <span className="font-bold text-xs text-[#14161C]">&gt;70% Margin</span>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Dark Green Featured */}
          <div className="bg-[#1E4E42] text-white rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="font-serif italic text-2xl sm:text-3xl font-normal text-white mb-4">
                &ldquo;An outbound game changer.&rdquo;
              </h3>
              <p className="text-white/85 text-sm leading-relaxed mb-6">
                &ldquo;Generic AI SDRs kept inventing funding rounds and fake team members. ProspectForge completely eliminated hallucinated claims and reduced our account research from 20 hours a week to zero.&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  SR
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">SERIES B FOUNDER</span>
                  <span className="text-[11px] text-white/70">Autonomous Outbound Benchmark</span>
                </div>
              </div>
              <span className="text-xs text-emerald-300 underline cursor-pointer" onClick={onOpenDashboard}>
                Read Case Study →
              </span>
            </div>
          </div>

          {/* Card 2: Light Teal Quote Box */}
          <div className="bg-[#EBF5F2] rounded-2xl p-8 flex flex-col justify-between border border-[#D5E6E1]">
            <div>
              <p className="text-sm text-[#14161C] leading-relaxed mb-6 font-normal">
                &ldquo;The <strong className="font-bold">self-healing recovery loop</strong> is incredible. When our initial ICP filter returned zero hits on Crustdata, the recovery controller broadened criteria automatically and recovered 15 verified leads without failing the run.&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#D5E6E1]">
              <span className="text-xs text-[#475569] font-medium">
                — MARCUS T., Head of Sales Ops | CloudScale Labs
              </span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
          </div>

          {/* Card 3: Light Teal Quote Box */}
          <div className="bg-[#EBF5F2] rounded-2xl p-8 flex flex-col justify-between border border-[#D5E6E1]">
            <div>
              <p className="text-sm text-[#14161C] leading-relaxed mb-6 font-normal">
                &ldquo;Having <strong className="font-bold">distributed traces in neatlogs</strong> for every planner, enricher, and verifier step gives us complete peace of mind. We can inspect every decision tree and token cost directly.&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#D5E6E1]">
              <span className="text-xs text-[#475569] font-medium">
                — ELENA R., Lead Platform Engineer | DataPulse
              </span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
          </div>

          {/* Card 4: Light Teal Quote Box */}
          <div className="bg-[#EBF5F2] rounded-2xl p-8 flex flex-col justify-between border border-[#D5E6E1]">
            <div>
              <p className="text-sm text-[#14161C] leading-relaxed mb-6 font-normal">
                &ldquo;<strong className="font-bold">Unit economics tracking via cfo.ai</strong> solved our biggest blind spot. At $0.089 per verified lead, we have crystal-clear profitability models across all outbound tiers.&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#D5E6E1]">
              <span className="text-xs text-[#475569] font-medium">
                — DAVID L., Founder &amp; CEO | StackFlow
              </span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
          </div>

        </div>
      </section>


      {/* ── 9. NAVY BLUE FINAL CTA ── */}
      <section className="w-full bg-[#0A1A2F] text-white py-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8">
            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-white mb-6 leading-tight">
              Stop sending fake claims.
              <br />
              Launch your verified pipeline <span className="italic font-serif">today.</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              <button
                id="bottom-signup-free"
                onClick={onOpenDashboard}
                className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#0A1A2F] font-bold text-sm px-8 py-3.5 rounded-full transition-colors cursor-pointer"
              >
                Launch Pipeline Run
              </button>
              <button
                onClick={onOpenDashboard}
                className="bg-transparent hover:bg-white/10 text-white font-semibold text-sm border border-white/40 px-8 py-3.5 rounded-full transition-colors cursor-pointer"
              >
                Explore Live neatlogs Traces
              </button>
            </div>
          </div>

          {/* Shooting Star / Comet Doodle */}
          <div className="md:col-span-4 flex justify-center">
            <svg className="w-64 h-48 text-[#2dd4bf]" viewBox="0 0 200 160" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="160" cy="40" r="14" strokeWidth="2.5" />
              <path d="M 148,48 L 50,140 M 165,55 L 75,145 M 135,35 L 40,130" strokeWidth="2" strokeDasharray="6 6" />
              <path d="M 150,20 L 150,26 M 175,30 L 180,30" />
            </svg>
          </div>

        </div>
      </section>


      {/* ── 10. MULTI-COLUMN FOOTER ── */}
      <footer className="w-full bg-[#071322] text-white py-16 px-6 lg:px-12 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Col 1: Logo & Copy */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-6 rounded-full bg-[#2dd4bf] flex items-center justify-center text-[#071322] font-bold text-xs">
                PF
              </div>
              <span className="font-serif font-bold text-base text-white">prospect forge</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Autonomous B2B account research, anti-hallucination verification, and distributed telemetry.
            </p>
          </div>

          {/* Col 2: PIPELINE */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              PIPELINE
            </h5>
            <ul className="space-y-2.5 text-zinc-300">
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Structured Planner</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Crustdata Enricher</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Fit Scorer</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Fact-Grounded Writer</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Claim Verifier</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Recovery Controller</button></li>
            </ul>
          </div>

          {/* Col 3: TELEMETRY & OBSERVABILITY */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              OBSERVABILITY
            </h5>
            <ul className="space-y-2.5 text-zinc-300">
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">neatlogs Distributed Tracing</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Live SSE Streams</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Execution DAG View</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Span Categorization</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Rate-Limit Telemetry</button></li>
            </ul>
          </div>

          {/* Col 4: UNIT ECONOMICS */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              UNIT ECONOMICS
            </h5>
            <ul className="space-y-2.5 text-zinc-300">
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">cfo.ai Margin Engine</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Bedrock Token Metering</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Crustdata Credit Accounting</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">&gt;70% Margin Enforcement</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Cost Per Lead Analytics</button></li>
            </ul>
          </div>

          {/* Col 5: STACK & INFRA */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              STACK &amp; INFRA
            </h5>
            <ul className="space-y-2.5 text-zinc-300 mb-6">
              <li><span className="text-zinc-400">AWS Bedrock (Claude 3.5)</span></li>
              <li><span className="text-zinc-400">Crustdata B2B API</span></li>
              <li><span className="text-zinc-400">FastAPI Orchestrator</span></li>
              <li><span className="text-zinc-400">Next.js 15 + React 19</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-800 text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 ProspectForge by Neatlogs. Built for neatlogs hackathon.</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-zinc-300" onClick={onOpenDashboard}>Privacy</span>
            <span className="cursor-pointer hover:text-zinc-300" onClick={onOpenDashboard}>Terms</span>
            <span className="cursor-pointer hover:text-zinc-300" onClick={onOpenDashboard}>Security</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
