"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, CheckCircle2, Clock } from "lucide-react";

export interface ThinkingStepItem {
  id: string;
  name: string;
  detail?: string;
  status: "done" | "running" | "recovering" | "queued" | "failed";
}

interface ThinkingStateProps {
  label?: string;
  steps?: ThinkingStepItem[];
  defaultExpanded?: boolean;
}

export default function ThinkingState({
  label = "Reasoning & Pipeline Strategy",
  steps = [],
  defaultExpanded = true
}: ThinkingStateProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full rounded-[22px] bg-[#1E1E1E] border border-[#333333] p-3.5 transition-all shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left group cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-indigo-400 animate-pulse" />
          <span
            className="text-[13px] font-semibold bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #A0A5B5 35%, #FFFFFF 50%, #A0A5B5 65%)",
              backgroundSize: "200% 100%",
              animation: "shimmer-text 1.6s linear infinite"
            }}
          >
            {label}
          </span>
        </div>
        <ChevronDown
          className={`size-4 text-[#8E8E8E] transition-transform duration-300 ${
            expanded ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#2C2C2C] relative pl-4">
          <div className="absolute left-[7px] top-4 bottom-2 w-px bg-[#333333]" />
          <div className="flex flex-col gap-2.5">
            {steps.map((st) => (
              <div key={st.id} className="relative flex items-start gap-2.5 text-xs">
                <span className="relative z-10 flex size-3.5 mt-0.5 items-center justify-center rounded-full bg-[#1A1A1A] ring-2 ring-[#2E2E2E]">
                  {st.status === "done" ? (
                    <span className="size-2 rounded-full bg-emerald-400" />
                  ) : st.status === "running" ? (
                    <span className="size-2 rounded-full bg-indigo-400 animate-ping" />
                  ) : st.status === "recovering" ? (
                    <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : (
                    <span className="size-2 rounded-full bg-[#484848]" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{st.name}</span>
                    <span
                      className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full border ${
                        st.status === "done"
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                          : st.status === "running"
                          ? "bg-indigo-950/80 text-indigo-300 border-indigo-700/60 animate-pulse"
                          : st.status === "recovering"
                          ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                          : "text-[#6E6E6E] border-transparent"
                      }`}
                    >
                      {st.status}
                    </span>
                  </div>
                  {st.detail && (
                    <p className="text-[11px] text-[#A0A0A0] mt-0.5 font-sans leading-relaxed">
                      {st.detail}
                    </p>
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
