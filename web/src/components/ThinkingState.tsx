"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, CheckCircle2, Clock } from "lucide-react";

interface StepItem {
  id: string;
  name: string;
  detail?: string;
  status: "done" | "running" | "recovering" | "queued" | "failed";
}

interface ThinkingStateProps {
  label?: string;
  steps?: StepItem[];
  defaultExpanded?: boolean;
}

export default function ThinkingState({
  label = "Reasoning & Pipeline Strategy",
  steps = [
    { id: "1", name: "Parse ICP & extract firmographic signals", detail: "Scanned niche criteria for high-growth tech", status: "done" },
    { id: "2", name: "Execute Crustdata graph query with credit budget guard", detail: "Evaluating candidate companies & funding stages", status: "running" },
    { id: "3", name: "Audit ground-truth facts against halluncination guardrail", detail: "Verified headcount and hiring signals", status: "queued" }
  ],
  defaultExpanded = true
}: ThinkingStateProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full rounded-[20px] bg-[#F5F6FA] border border-slate-200/80 p-3.5 transition-all">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left group"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          <span
            className="text-[13px] font-semibold bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #717684 35%, #14161C 50%, #717684 65%)",
              backgroundSize: "200% 100%",
              animation: "shimmer-text 1.4s linear infinite"
            }}
          >
            {label}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
            expanded ? "rotate-180 text-slate-700" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 relative pl-4">
          <div className="absolute left-[7px] top-4 bottom-2 w-px bg-slate-200" />
          <div className="flex flex-col gap-2.5">
            {steps.map((st) => (
              <div key={st.id} className="relative flex items-start gap-2.5 text-xs">
                <span className="relative z-10 flex size-3.5 mt-0.5 items-center justify-center rounded-full bg-white ring-2 ring-slate-100">
                  {st.status === "done" ? (
                    <span className="size-2 rounded-full bg-emerald-500" />
                  ) : st.status === "running" ? (
                    <span className="size-2 rounded-full bg-blue-600 animate-ping" />
                  ) : (
                    <span className="size-2 rounded-full bg-slate-300" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#14161C]">{st.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        st.status === "done"
                          ? "bg-emerald-50 text-emerald-700"
                          : st.status === "running"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-400"
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>
                  {st.detail && (
                    <p className="text-[11px] text-[#5B6170] mt-0.5">{st.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
