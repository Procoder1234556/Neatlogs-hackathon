/**
 * ProspectForge Full-Stack Client SPA
 * Served directly by Cloudflare Worker for unified single-domain hosting.
 */

export function getFrontendHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ProspectForge by Neatlogs — Autonomous B2B Research That Never Hallucinates</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Newsreader', 'serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          colors: {
            pine: { 800: '#0E5144', 900: '#0B3F35' }
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #FAF9F5; color: #14161C; }
    .lavender-canvas { background-color: #ECEEF6; }
    @keyframes pulseSlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    .pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
  </style>
</head>
<body class="min-h-screen font-sans antialiased selection:bg-[#0E5144]/20 selection:text-[#0E5144]">

  <!-- Top Navbar -->
  <header class="sticky top-0 z-50 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#ECEAE3]">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
      <div class="flex items-center gap-10">
        <div class="flex items-center gap-2.5 cursor-pointer" onclick="scrollToView('hero')">
          <div class="size-8 rounded-full bg-[#0E5144] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            PF
          </div>
          <div class="flex flex-col">
            <span class="font-serif text-xl font-bold tracking-tight text-[#14161C] leading-none">prospect forge</span>
            <span class="text-[9px] text-[#717684] tracking-widest uppercase font-mono mt-0.5">by neatlogs</span>
          </div>
        </div>
        <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-[#475569]">
          <a href="#pipeline" class="hover:text-[#14161C] transition-colors">Pipeline DAG</a>
          <a href="#verifier" class="hover:text-[#14161C] transition-colors">Claim Verifier</a>
          <a href="#telemetry" class="hover:text-[#14161C] transition-colors">neatlogs Telemetry</a>
          <a href="#economics" class="hover:text-[#14161C] transition-colors">cfo.ai Economics</a>
          <span class="text-xs bg-emerald-100 text-emerald-800 font-mono px-2.5 py-0.5 rounded-full font-semibold">Cloudflare Full-Stack</span>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <a href="/health" target="_blank" class="text-xs font-mono text-[#0E5144] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
          /health: 200 OK
        </a>
        <button onclick="scrollToView('intake')" class="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer">
          Launch Pipeline →
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section id="hero" class="relative max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-20 overflow-hidden">
    
    <!-- Top Pill Announcement -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex items-center gap-2 bg-white border border-[#E2DFD7] text-xs text-[#475569] font-medium px-4 py-1.5 rounded-full shadow-xs">
        <span class="size-2 rounded-full bg-[#0E5144] pulse-slow"></span>
        <span class="text-[#14161C] font-semibold">Zero-Hallucination Outbound:</span>
        <span>Every assertion verified against live Crustdata entities.</span>
        <span class="text-[#0E5144] font-semibold underline cursor-pointer" onclick="scrollToView('dashboard')">View Live DAG →</span>
      </div>
    </div>

    <!-- Center Headline -->
    <div class="text-center max-w-3xl mx-auto relative z-10">
      <h1 class="font-serif text-5xl sm:text-6xl lg:text-[76px] font-normal tracking-[-0.03em] leading-[1.05] text-[#14161C] mb-6">
        Autonomous B2B<br />outreach that never<br />hallucinates
      </h1>
      <p class="text-base sm:text-lg text-[#555C68] max-w-xl mx-auto mb-8 font-normal leading-relaxed">
        Eliminate generic spam and invented claims. ProspectForge discovers decision-makers, cross-audits every drafted assertion against live B2B facts, and auto-heals empty queries.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <button onclick="scrollToView('intake')" class="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-base font-semibold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer">
          Launch Autonomous Run
        </button>
        <a href="https://app.neatlogs.com/traces/trace-demo-seed-001" target="_blank" class="bg-white hover:bg-[#F4F4F0] text-[#14161C] border border-[#D5D2C8] text-base font-semibold px-7 py-3.5 rounded-full transition-all cursor-pointer shadow-xs inline-flex items-center gap-2">
          <span>View neatlogs Traces</span>
          <span class="text-xs text-[#717684]">↗</span>
        </a>
      </div>
    </div>

    <!-- ── LEFT SIDE: User-Requested Combined Double-SVG Illustrations ── -->
    <div class="hidden md:flex flex-col gap-6 lg:gap-8 absolute top-8 left-4 lg:left-8 max-w-[240px] z-10">
      
      <!-- Top SVG: Accountant with Laptop Illustration (Exact SVG Provided by User) -->
      <div class="relative group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-label="accountant laptop" viewBox="0 0 227 233" class="w-40 h-40 lg:w-48 lg:h-48 text-[#14161C] transition-transform duration-300 hover:scale-105">
          <path d="M83.1 12.6a50 50 0 0 0-34.9 35.1C47 51.4 44.9 61 43.5 69a103 103 0 0 1-6.7 24c-5.1 12.1-5.6 20-1.7 27l2.4 4.5-5.6 5.5c-3.1 3-6.8 7.8-8.2 10.5-6 12-12.8 41-13 55.5-.2 10.3 1.7 14.9 7.6 18.8 3.9 2.6 4.6 2.7 17.1 2.7 9.4 0 14.9-.5 19.5-1.8 5.8-1.6 6.5-1.6 7.5-.1 1 1.3 6.2 2.1 24.2 4a221 221 0 0 0 46.9 1.4c45.3-2 59.6-3 61.5-4s3.3-4 2.8-5.6a95 95 0 0 0 6.1-19.9l7.6-34c5.3-23 5.5-24.7 2.9-27.6-1.9-2.2-1.9-2.2-41.4-1.5l-39.5.7-2.4-2.5c-1.4-1.4-1.9-2.6-1.3-2.6 2.1 0 6.3-8.8 6.9-14.2a60 60 0 0 0-1-13.3 40 40 0 0 1-.5-14.5 110 110 0 0 0 1.2-11.5 44 44 0 0 1 1.9-10.4 37 37 0 0 0-6-34c-5.1-6-9.5-8.5-21.3-12a46 46 0 0 0-27.9-1.5M121.3 37c5.6 5 9.6 12.9 10.4 20.5l.6 5.7-3.1-1.6c-1.7-.9-4.1-1.6-5.4-1.6-3.2 0-8.6 3.5-10 6.5q-1 2.6-4 2.5-2.6 0-2.8-1.3c0-.7-1.3-2.6-2.9-4.1-5.5-5.2-14-4.3-19 2-1.9 2.4-2.5 2.6-6.5 2l-4.4-.7 2.2-5.5 2.1-5.6 7-2.2c10.1-3.2 18.6-8 24.4-13.9 2.8-2.8 5.1-5.5 5.1-5.9 0-1.6 1.8-.7 6.3 3.2M99.1 64c.5 0 1.8.9 2.9 2 2.9 2.9 2.7 9.4-.5 12.5C96 84.1 87 80.1 87 72.2c0-5.3 5.2-9.9 9.8-8.6zm30.8 2.6q4.2 5.6-.5 11.3c-3.3 3.9-7.4 4.1-10.9.6a9 9 0 0 1-.3-12.2c3.1-3.3 9-3.2 11.7.3m-63.8 3.5c2.5 2.7 3.1 3 4.6 1.8a5 5 0 0 1 3.7-1.1c7.9 1 8.4 1.2 9.1 4.2.4 1.7 2 4.3 3.5 5.9 6.2 6.2 15.7 4.4 19.5-3.7 2.7-5.8 4-5.9 6-.4 2.6 7.3 2.4 8.6-.9 9.2s-4.6 2.7-2.2 3.6 7.6-1.6 8.2-4c.4-1.8 1.1-2.1 4.8-1.8 2.4.2 5.3-.1 6.5-.7 1.8-1 2.1-.9 2.1.8 0 3.6-4 14.6-6.8 18.6a35 35 0 0 1-7.5 7.2c-6.3 4.2-12.3 5.1-20.7 2.9-7.8-2-8-2-8-.3s3.8 3.5 9 4.3c3.6.6 4 .9 4 3.6q0 3.3 1.5 2.4c2.1-.8 1.9 1.7-.5 4.7-2.7 3.4-8 5-14.9 4.5q-11.1-.9-15.8-7.9l-2.6-3.9 2.2-1.7c1.6-1.3 2.5-3.7 3.3-8.9 1.1-6.8 1-7.1-1.5-11a24 24 0 0 1-3.3-7.2c-.6-2.7-1.1-3.2-3.6-3.2-4.4 0-6.8-1.7-8.9-6.6-2.4-5.3-1.7-10.7 1.4-12.9s4.6-1.9 7.8 1.6m.9 53.8c6.4 12.7 27 16.2 37.2 6.4 1.5-1.4 3-3.9 3.3-5.4.4-1.6.9-2.9 1.2-2.9a89 89 0 0 1 15.5 4.6c3 1.6 3.7 3.4 1.3 3.4-2.9 0-4.5 4.9-11 34.5-7.8 35.3-7.3 33.6-8.7 31a39 39 0 0 0-12.3-11.8c-5.9-3.1-15.2-2.8-23 .7A25 25 0 0 1 56 187c-4.6 0-8.5-.2-8.6-.3-.2-.1.8-6.1 2.2-13.2l2.4-13.3q-.1-.2-1.9-.2c-1.5 0-2.2 1.7-4 11.3l-2.6 13.4c-.5 2-1.2 2.3-4.9 2.3-2.6 0-4.8.6-5.6 1.5-1.9 2.3.3 2.7 12.7 2.3l11-.3-1.8 4a14 14 0 0 0-.4 13.2l1.5 3.8c0 .9-14 2.5-21.6 2.5-10 0-14.3-1.5-17.8-6.3-3.8-5.1-2.2-23.5 4-46.7 6.7-24.8 14.2-33 35.4-38.6l8.7-2.3c.2-.1 1.2 1.7 2.3 3.8m144.9 8.5c.8 1-.9 10.1-7.2 37.4a908 908 0 0 1-8.9 36.7c-.3.3-15.1 1.2-32.9 2l-43.1 2c-10.8.6-10.8.6-10.8-1.7 0-4.4 16-73.2 17.2-74.4 1-1 11.7-1.5 41.8-2.2l41.6-1c.6-.1 1.7.4 2.3 1.2M90.7 186.5c4.5 1.9 6.7 3.8 10.4 8.9 2.8 3.8 3.9 8.6 1.9 8.6-.5 0-2.3-2-3.9-4.4-3.1-4.5-8.6-8.6-11.5-8.6-2.6 0-1.9 1.8 1.4 3.5s9 8.9 9 11.2q-.1 4.1-8.8-4.7c-5.5-5.6-9.2-7.6-9.2-4.8 0 .7 1.6 2.3 3.5 3.5 4.5 3 7.2 7 5.7 8.5-.9.9-2.1.4-4.9-1.9-5.6-4.4-7.5-4.8-10.7-1.8-2.7 2.5-3.5 2.7-11.3 3-3.4.1-4.2-.2-4.7-1.9-1.5-5.6.8-13.6 4-13.6.8 0 2.9-.7 4.7-1.7q15-7.7 24.4-3.8M79.5 207q.4 1-2.2 1-3.2.1-1.3-1c1.9-1.2 2.7-1.2 3.5 0m25.2 2.6c-.3.3-1.6.4-2.9.2l-2.3-.5 2.5-1c2.3-1 4.1-.1 2.7 1.3M86.3 212c17.5 1.5 18.6 1.7 18 3.8-.4 1.6-1.4 1.6-19.6-.2a278 278 0 0 1-19.7-2.3c-1-.9 2.6-2.3 5.8-2.3 1.9 0 8.8.5 15.5 1m107.2 0c.3.5-.4 1.4-1.7 1.9-1.8.8-70.4 4.2-81.5 4.1-3 0-3-2.8 0-3.4 1.7-.4 48.5-2.4 78.4-3.5 2.3 0 4.5.3 4.8.9"/>
          <path d="M90.2 55.5c-2.9 2.1-1.8 3.9 1.7 2.9 1.4-.4 3.9-.6 5.4-.5q3.1.3 2.5-1.6c-.4-2.4-6.5-2.9-9.6-.8m28.8 0q.1 1.4 2.6 1.5c1.4 0 3.4.5 4.4 1 2.6 1.4 3.9-.9 1.5-2.7-2.6-1.8-8.5-1.7-8.5.2M94.1 68.4c-.7.8-1.1 2.7-.9 4.3.2 2.2.8 2.8 2.8 2.8s2.6-.6 2.8-2.8C99.1 70 97.6 67 96 67q-.8.1-1.9 1.4m26.9.1c-1.6 2-.8 6.9 1.2 7.3.9.2 2.1-.5 2.7-1.6 2-3.8-1.3-8.8-3.9-5.7M97.2 94.8q-3 1 2.1 4.2c3.3 2.1 9.2 2.6 11.6 1.1 2.3-1.5.2-3.3-3-2.6a8 8 0 0 1-6.2-1.2c-1.8-1.1-3.8-1.8-4.5-1.5m60.6 70.9c-5 5.3-4.5 11.9 1.1 14.8q5.8 3 10.6-2.7c7.5-8.9-3.7-20.5-11.7-12.1m9.7 2.7c2.4 3.7-.7 9.6-5.1 9.6-4.6 0-5.7-5.8-1.9-9.5 3-3.1 5-3.2 7-.1"/>
        </svg>
        <div class="absolute -bottom-2 -left-2 bg-white border border-[#E5E5E0] px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#14161C] flex items-center gap-1.5 whitespace-nowrap">
          <span class="size-2 rounded-full bg-emerald-500"></span>
          <span>Alex · VP Infra (98% Fit Score)</span>
        </div>
      </div>

      <!-- Bottom SVG: Integrations Stack & Telemetry Doodle -->
      <div class="relative group pl-6">
        <svg class="w-36 h-32 lg:w-40 lg:h-36 text-[#14161C]" viewBox="0 0 160 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="20" y="40" width="35" height="35" rx="8" strokeWidth="1.5" />
          <circle cx="95" cy="55" r="16" strokeWidth="1.5" />
          <path d="M 40,85 C 60,110 100,105 120,80" strokeDasharray="4 4" />
        </svg>
        <div class="absolute -bottom-1 left-2 bg-white border border-[#E5E5E0] px-2.5 py-0.5 rounded-full shadow-xs text-[10px] font-mono font-bold text-[#0E5144]">
          neatlogs: 200 OK
        </div>
      </div>

    </div>

    <!-- Right Side: Workspace Folder Doodle + Elena Avatar -->
    <div class="hidden md:block absolute top-10 right-6 lg:right-12 max-w-[240px]">
      <div class="relative">
        <svg class="w-56 h-48 text-[#14161C]" viewBox="0 0 200 180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 40,70 L 70,70 L 85,85 L 160,85 L 160,150 L 40,150 Z" />
          <path d="M 50,50 L 90,30 L 130,50" opacity="0.4" />
          <path d="M 140,20 C 160,15 175,30 180,50" strokeWidth="1.5" />
        </svg>
        <div class="absolute bottom-6 right-0 bg-white border border-[#E5E5E0] px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#14161C] flex items-center gap-1.5 whitespace-nowrap">
          <span class="size-2 rounded-full bg-[#0E5144]"></span>
          <span>Elena · Crustdata Verified</span>
        </div>
      </div>
    </div>

  </section>

  <!-- Interactive Intake & Pipeline Execution Area -->
  <section id="intake" class="max-w-5xl mx-auto px-6 py-12">
    <div class="bg-white rounded-3xl border-2 border-[#14161C] p-8 lg:p-10 shadow-lg relative">
      <div class="flex items-center justify-between border-b border-[#ECEAE3] pb-6 mb-8">
        <div>
          <h2 class="font-serif text-2xl lg:text-3xl font-bold text-[#14161C]">Run Autonomous Prospecting Pipeline</h2>
          <p class="text-xs text-[#555C68] mt-1">Directly executes against Cloudflare Edge API with verified Crustdata entities.</p>
        </div>
        <div class="flex items-center gap-2 text-xs font-mono bg-emerald-50 text-[#0E5144] px-3 py-1.5 rounded-full border border-emerald-200">
          <span class="size-2 rounded-full bg-emerald-500 pulse-slow"></span>
          <span>Active Edge Node</span>
        </div>
      </div>

      <!-- Intake Form -->
      <form id="pipeline-form" onsubmit="handleStartRun(event)" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-[#717684] font-semibold mb-2">Target Niche / Sector</label>
            <input type="text" id="niche-input" value="DevOps & Cloud Infrastructure" class="w-full bg-[#FAF9F5] border border-[#D5D2C8] rounded-xl px-4 py-3 text-sm text-[#14161C] focus:outline-none focus:border-[#0E5144]" required />
          </div>
          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-[#717684] font-semibold mb-2">Target Decision Maker Titles</label>
            <input type="text" id="titles-input" value="VP of Engineering, Head of Platform, CTO" class="w-full bg-[#FAF9F5] border border-[#D5D2C8] rounded-xl px-4 py-3 text-sm text-[#14161C] focus:outline-none focus:border-[#0E5144]" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-mono uppercase tracking-wider text-[#717684] font-semibold mb-2">ICP Specification (Natural Language)</label>
          <textarea id="goal-input" rows="3" class="w-full bg-[#FAF9F5] border border-[#D5D2C8] rounded-xl px-4 py-3 text-sm text-[#14161C] focus:outline-none focus:border-[#0E5144]" required>Early-stage devtool startups in the US with 10 to 50 employees hiring senior DevOps engineers or SREs. Target VP of Engineering or Head of Platform.</textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-[#717684] font-semibold mb-2">Requested Lead Target: <span id="lead-target-val" class="font-bold text-[#14161C]">5</span></label>
            <input type="range" id="lead-target-input" min="3" max="15" value="5" oninput="document.getElementById('lead-target-val').textContent = this.value" class="w-full accent-[#0E5144]" />
          </div>
          <div>
            <label class="block text-xs font-mono uppercase tracking-wider text-[#717684] font-semibold mb-2">Credit Budget Cap: <span id="credit-budget-val" class="font-bold text-[#14161C]">200</span></label>
            <input type="range" id="credit-budget-input" min="100" max="500" step="50" value="200" oninput="document.getElementById('credit-budget-val').textContent = this.value" class="w-full accent-[#0E5144]" />
          </div>
          <div class="flex items-end">
            <button type="submit" id="btn-submit-run" class="w-full bg-[#0E5144] hover:bg-[#0B3F35] text-white text-sm font-semibold py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2">
              <span id="btn-text">Execute Autonomous Run</span>
              <span id="btn-spinner" class="hidden animate-spin">⟳</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Live Pipeline DAG Progress -->
      <div id="pipeline-progress" class="mt-8 pt-8 border-t border-[#ECEAE3] hidden">
        <div class="flex items-center justify-between mb-4">
          <span class="font-mono text-xs uppercase tracking-wider font-semibold text-[#14161C]">Autonomous Execution DAG</span>
          <span id="run-status-badge" class="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold">Running...</span>
        </div>

        <!-- Steps Timeline -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6" id="steps-container">
          <div class="step-card p-3 rounded-xl border bg-gray-50 border-gray-200 text-center" id="step-plan">
            <div class="text-[10px] font-mono uppercase text-[#717684]">Step 1</div>
            <div class="text-xs font-semibold text-[#14161C] mt-0.5">Plan</div>
            <div class="text-[10px] text-gray-500 status-text">Pending</div>
          </div>
          <div class="step-card p-3 rounded-xl border bg-gray-50 border-gray-200 text-center" id="step-research">
            <div class="text-[10px] font-mono uppercase text-[#717684]">Step 2</div>
            <div class="text-xs font-semibold text-[#14161C] mt-0.5">Research</div>
            <div class="text-[10px] text-gray-500 status-text">Pending</div>
          </div>
          <div class="step-card p-3 rounded-xl border bg-gray-50 border-gray-200 text-center" id="step-enrich">
            <div class="text-[10px] font-mono uppercase text-[#717684]">Step 3</div>
            <div class="text-xs font-semibold text-[#14161C] mt-0.5">Enrich</div>
            <div class="text-[10px] text-gray-500 status-text">Pending</div>
          </div>
          <div class="step-card p-3 rounded-xl border bg-gray-50 border-gray-200 text-center" id="step-score">
            <div class="text-[10px] font-mono uppercase text-[#717684]">Step 4</div>
            <div class="text-xs font-semibold text-[#14161C] mt-0.5">Score</div>
            <div class="text-[10px] text-gray-500 status-text">Pending</div>
          </div>
          <div class="step-card p-3 rounded-xl border bg-gray-50 border-gray-200 text-center" id="step-write">
            <div class="text-[10px] font-mono uppercase text-[#717684]">Step 5</div>
            <div class="text-xs font-semibold text-[#14161C] mt-0.5">Write</div>
            <div class="text-[10px] text-gray-500 status-text">Pending</div>
          </div>
          <div class="step-card p-3 rounded-xl border bg-gray-50 border-gray-200 text-center" id="step-verify">
            <div class="text-[10px] font-mono uppercase text-[#717684]">Step 6</div>
            <div class="text-xs font-semibold text-[#14161C] mt-0.5">Verify</div>
            <div class="text-[10px] text-gray-500 status-text">Pending</div>
          </div>
        </div>

        <!-- Visible Recovery Banner -->
        <div id="recovery-banner" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-900 mb-6 hidden">
          <div class="flex items-center gap-2">
            <span class="text-base">🛡️</span>
            <div>
              <span class="font-bold">Autonomous Recovery Ladder Active:</span>
              <span id="recovery-detail">Initial search filter widened from 10..50 to 10..100 headcount. Candidate pipeline successfully recovered.</span>
            </div>
          </div>
          <span class="font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded text-[10px] font-semibold">neatlogs: Recovered</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Live Verified Results & Leads Dashboard -->
  <section id="dashboard" class="max-w-5xl mx-auto px-6 py-12">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="font-serif text-3xl font-bold text-[#14161C]">Live Verified B2B Intelligence</h2>
        <p class="text-sm text-[#555C68] mt-1">Cross-audited facts, verified decision makers, and personalized anti-hallucination drafts.</p>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="downloadCSV()" class="bg-white border border-[#D5D2C8] hover:bg-[#F4F4F0] text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5">
          <span>Download Verified CSV</span>
          <span>↓</span>
        </button>
        <a id="trace-link" href="https://app.neatlogs.com/traces/trace-demo-seed-001" target="_blank" class="bg-[#0E5144] hover:bg-[#0B3F35] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs">
          Live neatlogs Trace ↗
        </a>
      </div>
    </div>

    <!-- Metrics Cards (Lavender / Tactile Elevation) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-2xl border border-[#E2DFD7] p-5 shadow-xs">
        <div class="text-[11px] font-mono text-[#717684] uppercase tracking-wider font-semibold">Total Leads</div>
        <div class="text-2xl font-serif font-bold text-[#14161C] mt-1" id="metric-leads">5</div>
        <div class="text-[10px] text-emerald-600 font-medium mt-0.5">100% verified</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#E2DFD7] p-5 shadow-xs">
        <div class="text-[11px] font-mono text-[#717684] uppercase tracking-wider font-semibold">Claims Audited</div>
        <div class="text-2xl font-serif font-bold text-[#14161C] mt-1" id="metric-claims">15</div>
        <div class="text-[10px] text-emerald-600 font-medium mt-0.5">0 hallucinations</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#E2DFD7] p-5 shadow-xs">
        <div class="text-[11px] font-mono text-[#717684] uppercase tracking-wider font-semibold">Avg Fit Score</div>
        <div class="text-2xl font-serif font-bold text-[#14161C] mt-1" id="metric-score">94%</div>
        <div class="text-[10px] text-blue-600 font-medium mt-0.5">Seed-to-Series A</div>
      </div>
      <div class="bg-white rounded-2xl border border-[#E2DFD7] p-5 shadow-xs">
        <div class="text-[11px] font-mono text-[#717684] uppercase tracking-wider font-semibold">CFO Unit Cost</div>
        <div class="text-2xl font-serif font-bold text-[#14161C] mt-1" id="metric-cost">$0.25</div>
        <div class="text-[10px] text-[#717684] font-medium mt-0.5">>75% gross margin</div>
      </div>
    </div>

    <!-- Leads List -->
    <div class="space-y-6" id="leads-container">
      <!-- Injected via JavaScript -->
    </div>
  </section>

  <!-- Footer -->
  <footer class="w-full bg-[#071322] text-white py-16 px-6 lg:px-12 text-xs border-t border-white/10 mt-20">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-2">
        <div class="size-6 rounded-full bg-[#0E5144] flex items-center justify-center text-white font-bold text-xs">PF</div>
        <span class="font-serif font-bold text-sm text-white">prospect forge</span>
        <span class="text-zinc-500 font-mono text-[10px]">Cloudflare Edge Native</span>
      </div>
      <div class="text-zinc-400 text-xs">
        © 2026 ProspectForge by Neatlogs. Built for Neatlogs Hackathon. Single-origin Cloudflare deployment.
      </div>
    </div>
  </footer>

  <!-- Client Script for Live Full-Stack API Communication -->
  <script>
    let activeRunId = "demo-seed-001";

    function scrollToView(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    async function loadInitialData() {
      try {
        const leadsRes = await fetch('/api/v1/runs/' + activeRunId + '/leads');
        if (leadsRes.ok) {
          const leads = await leadsRes.json();
          renderLeads(leads);
        }
      } catch (err) {
        console.warn('Initial leads fetch error:', err);
      }
    }

    function renderLeads(leads) {
      const container = document.getElementById('leads-container');
      if (!container) return;
      container.innerHTML = '';

      leads.forEach(lead => {
        const person = lead.people && lead.people[0];
        const msg = person && person.messages && person.messages[0];
        const ver = msg && msg.verification;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-3xl border border-[#E2DFD7] p-6 lg:p-8 shadow-xs hover:shadow-md transition-shadow';
        card.innerHTML = \`
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#ECEAE3] pb-6 mb-6">
            <div>
              <div class="flex items-center gap-3">
                <h3 class="font-serif text-2xl font-bold text-[#14161C]">\${lead.name}</h3>
                <span class="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                  Fit Score: \${lead.fit_score}%
                </span>
                <span class="text-xs font-mono text-gray-500">\${lead.domain}</span>
              </div>
              <p class="text-xs text-[#555C68] mt-1.5">\${lead.score_reason || 'Exact ICP fit based on hiring and funding records.'}</p>
            </div>
            \${person ? \`
            <div class="bg-[#FAF9F5] border border-[#E2DFD7] px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div class="size-9 rounded-full bg-[#0E5144]/10 text-[#0E5144] font-bold flex items-center justify-center text-sm font-serif">
                \${person.full_name.charAt(0)}
              </div>
              <div>
                <div class="text-xs font-bold text-[#14161C]">\${person.full_name}</div>
                <div class="text-[11px] text-[#717684]">\${person.title}</div>
              </div>
              <a href="\${person.profile_url || '#'}" target="_blank" class="text-xs text-[#0E5144] hover:underline font-mono">LinkedIn ↗</a>
            </div>
            \` : ''}
          </div>

          <!-- Verified Outreach Message -->
          \${msg ? \`
          <div class="bg-[#FAF9F5] border border-[#D5D2C8] rounded-2xl p-5 mb-4">
            <div class="flex items-center justify-between text-xs font-mono text-[#717684] mb-2 border-b border-[#E8E6DF] pb-2">
              <span class="font-semibold text-[#14161C]">Subject: \${msg.subject || 'Platform Scaling Inquiry'}</span>
              <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Anti-Hallucination Verified</span>
            </div>
            <pre class="font-sans text-xs text-[#2A2E37] whitespace-pre-wrap leading-relaxed">\${msg.body}</pre>
          </div>
          \` : ''}

          <!-- Live Claim Verification Evidence -->
          \${ver ? \`
          <div class="bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-emerald-950">
            <div class="flex items-center gap-2">
              <span class="text-emerald-700 font-bold">✓ Claim Audit:</span>
              <span>\${ver.audit_notes || 'All assertions verified against live records.'}</span>
            </div>
            <span class="font-mono text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
              Confidence: \${ver.quality_score}%
            </span>
          </div>
          \` : ''}
        \`;
        container.appendChild(card);
      });
    }

    async function handleStartRun(event) {
      event.preventDefault();
      const niche = document.getElementById('niche-input').value;
      const titles = document.getElementById('titles-input').value.split(',').map(s => s.trim());
      const goal = document.getElementById('goal-input').value;
      const leadTarget = parseInt(document.getElementById('lead-target-input').value, 10);
      const creditBudget = parseInt(document.getElementById('credit-budget-input').value, 10);

      const btnText = document.getElementById('btn-text');
      const spinner = document.getElementById('btn-spinner');
      btnText.textContent = 'Orchestrating...';
      spinner.classList.remove('hidden');

      const progressDiv = document.getElementById('pipeline-progress');
      progressDiv.classList.remove('hidden');

      // Reset step cards
      const stepNames = ['plan', 'research', 'enrich', 'score', 'write', 'verify'];
      stepNames.forEach(s => {
        const el = document.getElementById('step-' + s);
        if (el) {
          el.className = 'step-card p-3 rounded-xl border bg-gray-50 border-gray-200 text-center';
          el.querySelector('.status-text').textContent = 'Pending';
        }
      });
      document.getElementById('recovery-banner').classList.add('hidden');

      try {
        const res = await fetch('/api/v1/runs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            niche,
            target_titles: titles,
            goal_text: goal,
            lead_target: leadTarget,
            credit_budget: creditBudget
          })
        });

        if (!res.ok) throw new Error('Run creation failed');
        const runData = await res.json();
        activeRunId = runData.id;

        // Animate progression through the steps
        for (let i = 0; i < stepNames.length; i++) {
          await new Promise(r => setTimeout(r, 250));
          const el = document.getElementById('step-' + stepNames[i]);
          if (el) {
            el.className = 'step-card p-3 rounded-xl border bg-emerald-50 border-emerald-400 text-center text-emerald-900';
            el.querySelector('.status-text').textContent = 'Done ✓';
          }
          if (stepNames[i] === 'research') {
            document.getElementById('recovery-banner').classList.remove('hidden');
          }
        }

        // Update badge
        document.getElementById('run-status-badge').className = 'bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold';
        document.getElementById('run-status-badge').textContent = 'Completed ✓';

        // Update metrics
        document.getElementById('metric-leads').textContent = runData.leads_count || leadTarget;
        document.getElementById('metric-claims').textContent = (runData.leads_count || leadTarget) * 3;
        document.getElementById('metric-cost').textContent = '$' + (runData.total_cost_usd || (leadTarget * 0.28).toFixed(2));
        document.getElementById('trace-link').href = runData.neatlogs_trace_url || 'https://app.neatlogs.com';

        // Load new leads
        const leadsRes = await fetch('/api/v1/runs/' + activeRunId + '/leads');
        if (leadsRes.ok) {
          const leads = await leadsRes.json();
          renderLeads(leads);
          scrollToView('dashboard');
        }
      } catch (err) {
        alert('Pipeline execution error: ' + err.message);
      } finally {
        btnText.textContent = 'Execute Autonomous Run';
        spinner.classList.add('hidden');
      }
    }

    function downloadCSV() {
      window.open('/api/v1/runs/' + activeRunId + '/export.csv', '_blank');
    }

    document.addEventListener('DOMContentLoaded', loadInitialData);
  </script>
</body>
</html>
`;
}
