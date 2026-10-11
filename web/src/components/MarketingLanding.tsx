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
  DollarSign
} from "lucide-react";

interface MarketingLandingProps {
  onOpenDashboard: () => void;
}

export default function MarketingLanding({ onOpenDashboard }: MarketingLandingProps) {
  const [selectedTag, setSelectedTag] = useState<"devops" | "founders" | "ai">("devops");

  return (
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#14161C] font-sans antialiased overflow-x-hidden selection:bg-[#0E5144]/20 selection:text-[#0E5144]">
      
      {/* ── 1. NAVBAR (Exact match to User Interviews header) ── */}
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
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer">
                <span>Platform</span>
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
              </div>
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer">
                <span>Solutions</span>
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
              </div>
              <span className="hover:text-[#14161C] cursor-pointer">Pricing</span>
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer">
                <span>Resources</span>
                <ChevronDown className="size-3.5 text-[#94A3B8]" />
              </div>
              <div className="flex items-center gap-1 hover:text-[#14161C] cursor-pointer">
                <span>Integrations</span>
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
              Sign In
            </button>
            <button
              id="nav-signup-free"
              onClick={onOpenDashboard}
              className="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Sign up free
            </button>
          </div>

        </div>
      </header>


      {/* ── 2. HERO: Exact User Interviews Layout with Doodles & Floating Avatars ── */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-20">
        
        {/* Top pill link */}
        <div className="flex justify-center mb-6">
          <button
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-2 bg-white border border-[#E2DFD7] text-xs text-[#475569] font-medium px-4 py-1.5 rounded-full shadow-xs hover:border-[#0E5144] transition-colors cursor-pointer"
          >
            <span className="size-2 rounded-full bg-[#0E5144]" />
            <span className="text-[#14161C] font-semibold">Meet ProspectForge:</span>
            <span>The autonomous pipeline behind B2B growth.</span>
            <span className="underline text-[#0E5144] font-semibold">Learn more →</span>
          </button>
        </div>

        {/* Center Headline */}
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[76px] font-normal tracking-[-0.03em] leading-[1.05] text-[#14161C] mb-6">
            We connect
            <br />
            researchers and
            <br />
            decision makers
          </h1>
          <p className="text-base sm:text-lg text-[#555C68] max-w-lg mx-auto mb-8 font-normal leading-relaxed">
            Get fast access to quality ICP leads or grow your pipeline autonomously with verified outreach.
          </p>
          <button
            id="hero-signup-free"
            onClick={onOpenDashboard}
            className="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-base font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Sign up free
          </button>
        </div>

        {/* ── KOBYOYO DOODLES & PIXABAY FLOATING AVATARS ── */}
        
        {/* Top Left: Researcher Persona with Pixabay Avatar */}
        <div className="hidden md:block absolute top-12 left-6 lg:left-12 max-w-[240px]">
          {/* Hand-drawn SVG doodle frame */}
          <div className="relative">
            <svg className="w-52 h-48 text-[#14161C]" viewBox="0 0 200 180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 30,130 C 20,90 25,50 60,35 C 90,20 130,25 150,55 C 165,80 155,130 130,150 C 95,170 45,160 30,130 Z" strokeDasharray="3 3" opacity="0.4" />
              {/* Hand-drawn sparkle marks */}
              <path d="M 170,30 L 170,45 M 162,37 L 178,37" strokeWidth="2.5" />
              <path d="M 20,40 L 20,50 M 15,45 L 25,45" strokeWidth="2" />
            </svg>
            
            {/* Real Pixabay Avatar 1 */}
            <div className="absolute top-8 left-8 size-20 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <Image
                src="/pixabay-avatar-1.jpg"
                alt="Research Specialist Lead from Pixabay"
                fill
                sizes="80px"
                priority
                className="object-cover"
              />
            </div>
            
            <div className="absolute -bottom-2 left-6 bg-white border border-[#E5E5E0] px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#14161C] flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Alex · DevOps Lead</span>
            </div>
          </div>
        </div>

        {/* Top Right: Workspace Folder Doodle + Pixabay Avatar 2 */}
        <div className="hidden md:block absolute top-10 right-6 lg:right-12 max-w-[240px]">
          <div className="relative">
            <svg className="w-56 h-48 text-[#14161C]" viewBox="0 0 200 180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Folder doodle */}
              <path d="M 40,70 L 70,70 L 85,85 L 160,85 L 160,150 L 40,150 Z" />
              <path d="M 50,50 L 90,30 L 130,50" opacity="0.4" />
              {/* Curved arrows & squiggles */}
              <path d="M 140,20 C 160,15 175,30 180,50" strokeWidth="1.5" />
            </svg>

            {/* Real Pixabay Avatar 2 */}
            <div className="absolute top-6 left-12 size-18 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <Image
                src="/pixabay-avatar-2.jpg"
                alt="VP of Engineering from Pixabay"
                fill
                sizes="72px"
                priority
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-6 right-2 bg-white border border-[#E5E5E0] px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#14161C] flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#0E5144]" />
              <span>Elena · Platform Head</span>
            </div>
          </div>
        </div>

        {/* Bottom Left: Integrations Stack Doodle + Pixabay Avatar 3 */}
        <div className="hidden lg:block absolute bottom-4 left-16 max-w-[200px]">
          <div className="relative">
            <svg className="w-44 h-40 text-[#14161C]" viewBox="0 0 160 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="20" y="40" width="35" height="35" rx="8" strokeWidth="1.5" />
              <circle cx="95" cy="55" r="16" strokeWidth="1.5" />
              <path d="M 40,85 C 60,110 100,105 120,80" strokeDasharray="4 4" />
            </svg>
            <div className="absolute top-2 left-6 size-16 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src="/pixabay-avatar-3.jpg"
                alt="Growth Ops Specialist from Pixabay"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Right: Laptop Doodle + Pixabay Avatar 4 */}
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
                alt="Product Researcher from Pixabay"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

      </section>


      {/* ── 3. LOGO TICKER: "Researchers at these companies gain insights faster" (Exact Reference Box) ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-5">
          <p className="font-serif italic text-lg sm:text-xl text-[#14161C]">
            Researchers at these companies gain insights <span className="font-serif italic font-bold">faster</span>
          </p>
        </div>

        {/* The clean outlined card with triple-dot header detail like reference */}
        <div className="bg-white rounded-2xl border-2 border-[#14161C] p-6 shadow-xs relative">
          {/* Triple dot illustration on top left border */}
          <div className="absolute -top-3 left-6 bg-white px-2 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-[#14161C]" />
            <span className="size-1.5 rounded-full bg-[#14161C]" />
            <span className="size-1.5 rounded-full bg-[#14161C]" />
          </div>

          <div className="flex flex-wrap items-center justify-around gap-8 text-[#14161C]">
            <span className="font-serif font-bold text-2xl tracking-tight">Adobe</span>
            <span className="font-sans font-extrabold text-2xl tracking-tight">Spotify</span>
            <span className="font-serif font-bold text-2xl tracking-tight">Pinterest</span>
            <span className="font-mono font-bold text-xl tracking-wider">INTUIT</span>
            <span className="font-serif font-bold text-2xl tracking-tight">NN/g</span>
            <span className="font-sans font-bold text-2xl tracking-tight">amazon</span>
          </div>
        </div>
      </section>


      {/* ── 4. TWO-PILLAR PLATFORM SECTION: "The research recruiting and insights platform" ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Title & Filter Pills */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#14161C] mb-4">
            The research recruiting and insights platform
          </h2>
          <p className="text-sm text-[#555C68] mb-6">
            Find participants from our panel, your panel, or both.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#EEECE4] p-1 rounded-full text-xs font-semibold">
            <span className="text-[#717684] px-3">For</span>
            <button
              onClick={() => setSelectedTag("devops")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedTag === "devops" ? "bg-[#14161C] text-white shadow-xs" : "text-[#555C68] hover:text-[#14161C]"
              }`}
            >
              user research
            </button>
            <button
              onClick={() => setSelectedTag("founders")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedTag === "founders" ? "bg-[#14161C] text-white shadow-xs" : "text-[#555C68] hover:text-[#14161C]"
              }`}
            >
              market research
            </button>
            <button
              onClick={() => setSelectedTag("ai")}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedTag === "ai" ? "bg-[#14161C] text-white shadow-xs" : "text-[#555C68] hover:text-[#14161C]"
              }`}
            >
              AI training
            </button>
          </div>
        </div>

        {/* Dual Cards (Recruit vs Research Hub) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card Left: Recruit / Participant Recruitment */}
          <div className="bg-[#F0F7F5] rounded-3xl p-8 border border-[#D5E6E1] flex flex-col justify-between shadow-xs">
            <div>
              {/* Inner Mockup Box (Matching User Interviews UI mock card) */}
              <div className="bg-white rounded-2xl p-5 border border-[#E0ECE8] shadow-sm mb-8 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] mb-4 text-xs font-semibold text-[#14161C]">
                  <span>Recruitment criteria</span>
                  <span className="text-[#0E5144] font-mono text-[11px]">+42% velocity</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#717684] uppercase font-mono block mb-1.5">Location</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-[#F4F4F0] px-2.5 py-1 rounded-md text-[#14161C] font-medium text-[11px]">United States ✕</span>
                      <span className="bg-[#F4F4F0] px-2.5 py-1 rounded-md text-[#14161C] font-medium text-[11px]">Canada ✕</span>
                      <span className="bg-[#F4F4F0] px-2.5 py-1 rounded-md text-[#14161C] font-medium text-[11px]">Australia ✕</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#717684] uppercase font-mono block mb-1.5">Target Job Title(s)</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-[#E6F3EF] text-[#0E5144] font-bold px-2.5 py-1 rounded-md text-[11px]">Software Engineer ✕</span>
                      <span className="bg-[#E6F3EF] text-[#0E5144] font-bold px-2.5 py-1 rounded-md text-[11px]">Product Manager ✕</span>
                    </div>
                  </div>

                  {/* Micro floating avatar stack */}
                  <div className="absolute right-4 top-10 flex flex-col gap-1.5">
                    <div className="size-8 rounded-full overflow-hidden border border-white shadow-sm relative">
                      <Image src="/pixabay-avatar-1.jpg" alt="Lead candidate" fill sizes="32px" className="object-cover" />
                    </div>
                    <div className="size-8 rounded-full overflow-hidden border border-white shadow-sm relative">
                      <Image src="/pixabay-avatar-2.jpg" alt="Lead candidate" fill sizes="32px" className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="size-2 rounded-full bg-[#0E5144]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#0E5144] font-bold">
                  recruit | PARTICIPANT RECRUITMENT
                </span>
              </div>

              <h3 className="font-serif text-3xl text-[#14161C] mb-4 leading-tight">
                Find qualified participants, fast
              </h3>

              <ul className="space-y-2 text-sm text-[#475569] mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Target professionals &amp; consumers in any niche</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Match within hours, not weeks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>AI-powered matching &amp; fraud detection</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenDashboard}
              className="w-fit bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Explore Recruit
            </button>
          </div>

          {/* Card Right: Research Hub / Participant CRM */}
          <div className="bg-[#F0F7F5] rounded-3xl p-8 border border-[#D5E6E1] flex flex-col justify-between shadow-xs">
            <div>
              {/* Inner Mockup Box */}
              <div className="bg-white rounded-2xl p-5 border border-[#E0ECE8] shadow-sm mb-8 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F5] mb-4 text-xs font-semibold text-[#14161C]">
                  <span>Entire population ▾</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="bg-[#E6F3EF] text-[#0E5144] px-2 py-0.5 rounded font-bold">Hub population</span>
                    <span className="text-[#717684]">Recruit population</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EBE8DC]">
                    <span className="font-medium text-[#14161C]">Entire Population</span>
                    <span className="font-mono text-[11px] text-[#717684]">10,422 panelists</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EBE8DC]">
                    <span className="font-medium text-[#14161C]">Beta Testers (Product Team)</span>
                    <span className="font-mono text-[11px] text-[#0E5144] font-bold">635 panelists</span>
                  </div>
                </div>

                {/* Starburst Doodle on top right */}
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
                  research hub | PARTICIPANT CRM
                </span>
              </div>

              <h3 className="font-serif text-3xl text-[#14161C] mb-4 leading-tight">
                Talk to your users without friction
              </h3>

              <ul className="space-y-2 text-sm text-[#475569] mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Invite real users to research studies</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Build user panels and enable self-serve recruiting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0E5144] font-bold">✓</span>
                  <span>Automate scheduling, incentives, consent &amp; contact rules</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenDashboard}
              className="w-fit bg-[#14161C] hover:bg-black text-white text-sm font-semibold px-6 py-3 rounded-full transition-all cursor-pointer shadow-xs"
            >
              Explore Research Hub
            </button>
          </div>

        </div>

        {/* ── 5. STATS BANNER: Exact "7.5 MILLION participants | 1 HOUR to first match..." border box ── */}
        <div className="mt-12 bg-white rounded-2xl border-2 border-[#14161C] p-6 shadow-xs relative">
          {/* Ribbon icon left */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden sm:block text-[#14161C]">
            <Award className="size-8 stroke-[1.5]" />
          </div>

          <div className="text-center font-mono text-xs sm:text-sm tracking-wider uppercase text-[#14161C] sm:px-16 leading-relaxed">
            <span className="font-bold">7.5 MILLION</span> participants &nbsp;|&nbsp;
            <span className="font-bold">1 HOUR</span> to first match &nbsp;|&nbsp;
            <span className="font-bold">98% POSITIVE</span> session feedback
            <br className="hidden md:block" />
            <span className="font-bold">22 TOOLS</span> integrated &nbsp;|&nbsp;
            <span className="font-bold">100% COMPATIBLE</span> with any method &nbsp;|&nbsp;
            <span className="font-bold">.6% SESSIONS</span> reported for fraud
          </div>

          {/* Starburst icon right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:block text-[#14161C]">
            <Sparkles className="size-8 stroke-[1.5]" />
          </div>
        </div>

      </section>


      {/* ── 6. "Start recruiting / SEE HOW IT WORKS" 3-STEP VERTICAL TIMELINE ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading + Koboyo Doodle character */}
          <div className="md:col-span-5">
            <h3 className="font-serif text-4xl sm:text-5xl text-[#14161C] mb-2 leading-tight">
              Start recruiting
            </h3>
            <span className="text-xs font-mono uppercase tracking-widest text-[#717684] block mb-8 font-bold">
              SEE HOW IT WORKS
            </span>

            {/* Koboyo Doodle Running Characters SVG */}
            <div className="text-[#14161C]">
              <svg className="w-48 h-36" viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Person 1 */}
                <circle cx="40" cy="35" r="14" />
                <path d="M 40,50 L 40,85 M 40,65 L 20,55 M 40,65 L 60,60" />
                <path d="M 40,85 L 25,115 M 40,85 L 55,110" />
                {/* Person 2 */}
                <circle cx="95" cy="40" r="14" />
                <path d="M 95,55 L 95,90 M 95,70 L 75,65 M 95,70 L 115,75" />
                <path d="M 95,90 L 80,118 M 95,90 L 110,115" />
                {/* Connecting hand-drawn flag */}
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
                <span className="font-mono text-xs text-[#717684] uppercase tracking-wider block font-bold">
                  STEP 1:
                </span>
              </div>
              <div>
                <h4 className="font-medium text-base text-[#14161C] mb-1">
                  Target and screen participants
                </h4>
                <p className="text-sm text-[#64748B]">
                  Find the best-fit candidates for any research study.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="py-6 flex items-start gap-6">
              <div className="pt-1">
                <span className="font-mono text-xs text-[#717684] uppercase tracking-wider block font-bold">
                  STEP 2:
                </span>
              </div>
              <div>
                <h4 className="font-medium text-base text-[#14161C] mb-1">
                  Integrate your favorite tools
                </h4>
                <p className="text-sm text-[#64748B]">
                  Connect to dozens of popular research and testing tools.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="py-6 flex items-start gap-6">
              <div className="pt-1">
                <span className="font-mono text-xs text-[#717684] uppercase tracking-wider block font-bold">
                  STEP 3:
                </span>
              </div>
              <div>
                <h4 className="font-medium text-base text-[#14161C] mb-1">
                  Automate every study run by your team
                </h4>
                <p className="text-sm text-[#64748B]">
                  Built-in scheduling, incentives, analysis, and more.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={onOpenDashboard}
                className="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold px-7 py-3 rounded-full transition-all cursor-pointer shadow-xs"
              >
                See plans &amp; pricing
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ── 7. DEEP MAROON BANNER: "Want to earn money participating in research?" ── */}
      <section className="w-full bg-[#5C1B33] text-white py-16 px-6 lg:px-12 my-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left: Koboyo Doodle with Arms Raised & Money Sack */}
          <div className="md:col-span-5 flex justify-center md:justify-start">
            <svg className="w-64 h-56 text-white" viewBox="0 0 200 180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Torso & Head */}
              <circle cx="100" cy="50" r="20" strokeWidth="2" />
              <path d="M 100,72 L 100,130" strokeWidth="3" />
              {/* Joyful arms raised */}
              <path d="M 100,85 L 60,40 M 60,40 L 40,30" strokeWidth="3" />
              <path d="M 100,85 L 140,40 M 140,40 L 160,30" strokeWidth="3" />
              {/* Floating Money ($) & Gift Icon */}
              <circle cx="35" cy="55" r="14" strokeWidth="1.5" />
              <text x="31" y="60" fill="currentColor" fontSize="14" fontWeight="bold">$</text>
              <rect x="145" y="65" width="22" height="22" rx="4" strokeWidth="1.5" />
              <path d="M 156,65 L 156,87 M 145,76 L 167,76" />
            </svg>
          </div>

          {/* Right: Copy & Button */}
          <div className="md:col-span-7">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white mb-4 leading-tight">
              Want to earn money participating in research?
            </h3>
            <p className="text-white/80 text-sm sm:text-base mb-8 font-light">
              Participants have earned <span className="font-bold text-white">$60 million</span> sharing feedback with leading companies.
            </p>
            <button
              onClick={onOpenDashboard}
              className="bg-transparent hover:bg-white/10 text-white font-semibold text-sm border-2 border-white px-8 py-3 rounded-full transition-colors cursor-pointer"
            >
              Sign up to participate
            </button>
          </div>

        </div>
      </section>


      {/* ── 8. TESTIMONIALS & G2 BADGES: "Industry leaders rely on User Interviews" ── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        
        {/* Header with Title + 3 G2 Badges */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#14161C] max-w-md leading-tight">
            Industry leaders rely on ProspectForge
          </h2>

          {/* 3 Ribbon Badges (High Performer, Leader, Momentum Leader) */}
          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#E5E5E0] rounded-xl px-4 py-2.5 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block font-bold">High</span>
              <span className="font-bold text-xs text-[#14161C]">Performer</span>
            </div>
            <div className="bg-white border border-[#E5E5E0] rounded-xl px-4 py-2.5 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block font-bold">G2</span>
              <span className="font-bold text-xs text-[#14161C]">Leader</span>
            </div>
            <div className="bg-white border border-[#E5E5E0] rounded-xl px-4 py-2.5 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 block font-bold">Momentum</span>
              <span className="font-bold text-xs text-[#14161C]">Leader</span>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid (1 Green Featured Card + 3 Mint/White Testimonial Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Dark Green Featured "A recruitment game changer." */}
          <div className="bg-[#1E4E42] text-white rounded-2xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <h3 className="font-serif italic text-2xl sm:text-3xl font-normal text-white mb-4">
                &ldquo;A recruitment game changer.&rdquo;
              </h3>
              <p className="text-white/85 text-sm leading-relaxed mb-6">
                ProspectForge has climbed to the #2 spot by solving one of the biggest headaches in research:{" "}
                <strong className="text-white">finding the right people to talk to.</strong>
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  LK
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">LENNY&apos;S NEWSLETTER</span>
                  <span className="text-[11px] text-white/70">State of Tech Tools 2026</span>
                </div>
              </div>
              <span className="text-xs text-emerald-300 underline cursor-pointer">See Report →</span>
            </div>
          </div>

          {/* Card 2: Light Teal Quote Box */}
          <div className="bg-[#EBF5F2] rounded-2xl p-8 flex flex-col justify-between border border-[#D5E6E1]">
            <div>
              <p className="text-sm text-[#14161C] leading-relaxed mb-6 font-normal">
                &ldquo;It has <strong className="font-bold">drastically increased the pace at which we can turn around research</strong> and reduced the manual steps in our flow. This is a tool I highly recommend!&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#D5E6E1]">
              <span className="text-xs text-[#475569] font-medium">
                — KAYLEE R., Research Ops Specialist | Houghton Mifflin Harcourt
              </span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
          </div>

          {/* Card 3: Light Teal Quote Box */}
          <div className="bg-[#EBF5F2] rounded-2xl p-8 flex flex-col justify-between border border-[#D5E6E1]">
            <div>
              <p className="text-sm text-[#14161C] leading-relaxed mb-6 font-normal">
                &ldquo;It helps our team perform <strong className="font-bold">rapid recruitment at scale</strong> when we want to recruit people who are not current HP customers.&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#D5E6E1]">
              <span className="text-xs text-[#475569] font-medium">
                — PEDRO O., Senior Experience Research Manager | HP
              </span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
          </div>

          {/* Card 4: Light Teal Quote Box */}
          <div className="bg-[#EBF5F2] rounded-2xl p-8 flex flex-col justify-between border border-[#D5E6E1]">
            <div>
              <p className="text-sm text-[#14161C] leading-relaxed mb-6 font-normal">
                &ldquo;<strong className="font-bold">Quality of participants is much better than other platforms.</strong> The demographic and background information is rich and helps to understand the participants better.&rdquo;
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#D5E6E1]">
              <span className="text-xs text-[#475569] font-medium">
                — NIVI S., Principal UX Researcher | Citizens Bank
              </span>
              <span className="text-amber-500 text-xs">★★★★★</span>
            </div>
          </div>

        </div>
      </section>


      {/* ── 9. NAVY BLUE FINAL CTA: "Talk to users today. Seriously, we're fast." ── */}
      <section className="w-full bg-[#0A1A2F] text-white py-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-8">
            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-white mb-6 leading-tight">
              Talk to users today.
              <br />
              Seriously, we&apos;re <span className="italic font-serif">fast.</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              <button
                id="bottom-signup-free"
                onClick={onOpenDashboard}
                className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-[#0A1A2F] font-bold text-sm px-8 py-3.5 rounded-full transition-colors cursor-pointer"
              >
                Sign up free
              </button>
              <button
                onClick={onOpenDashboard}
                className="bg-transparent hover:bg-white/10 text-white font-semibold text-sm border border-white/40 px-8 py-3.5 rounded-full transition-colors cursor-pointer"
              >
                Book a demo
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


      {/* ── 10. MULTI-COLUMN FOOTER (Exact structure of User Interviews) ── */}
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
              Autonomous B2B participant research &amp; verified outreach.
            </p>
          </div>

          {/* Col 2: PRODUCT */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              PRODUCT
            </h5>
            <ul className="space-y-2.5 text-zinc-300">
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Recruit</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Research Hub</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Pricing</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Integrations &amp; APIs</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Security</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Panel Reports</button></li>
              <li><button onClick={onOpenDashboard} className="hover:text-white cursor-pointer">Case Studies</button></li>
            </ul>
          </div>

          {/* Col 3: RESEARCHER RESOURCES */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              RESEARCHER RESOURCES
            </h5>
            <ul className="space-y-2.5 text-zinc-300">
              <li><span className="text-zinc-400">Help Center</span></li>
              <li><span className="text-zinc-400">User Interviews Academy</span></li>
              <li><span className="text-zinc-400">Field Guide</span></li>
              <li><span className="text-zinc-400">Blog</span></li>
              <li><span className="text-zinc-400">Podcast</span></li>
              <li><span className="text-zinc-400">Incentive Calculator</span></li>
            </ul>
          </div>

          {/* Col 4: PARTICIPANT RESOURCES */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              PARTICIPANT RESOURCES
            </h5>
            <ul className="space-y-2.5 text-zinc-300">
              <li><span className="text-zinc-400">Help Center</span></li>
              <li><span className="text-zinc-400">Browse All Studies</span></li>
              <li><span className="text-zinc-400">Focus Groups Studies</span></li>
              <li><span className="text-zinc-400">Diary Studies</span></li>
              <li><span className="text-zinc-400">Refer a Participant</span></li>
            </ul>
          </div>

          {/* Col 5: COMPANY & COMPARE */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-4">
              COMPANY
            </h5>
            <ul className="space-y-2.5 text-zinc-300 mb-6">
              <li><span className="text-zinc-400">About Us</span></li>
              <li><span className="text-zinc-400">Careers</span></li>
              <li><span className="text-zinc-400">Partnerships</span></li>
            </ul>

            <h5 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-bold mb-3">
              COMPARE
            </h5>
            <ul className="space-y-2 text-zinc-400 text-[11px]">
              <li><span>vs. Respondent</span></li>
              <li><span>vs. Dscout</span></li>
              <li><span>vs. Qualtrics</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-800 text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 ProspectForge by Neatlogs. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Researcher Terms</span>
            <span>Participant Terms</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
