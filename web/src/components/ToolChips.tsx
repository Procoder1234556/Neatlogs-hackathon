"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, Check, Wrench } from "lucide-react";

export interface ToolCallItem {
  id: string;
  toolName: string;
  durationMs?: number;
  status: "success" | "running" | "fallback" | "recovered";
  paramsSnippet?: string;
}

interface ToolChipsProps {
  toolCalls?: ToolCallItem[];
}

export default function ToolChips({
  toolCalls = [
    { id: "tc-1", toolName: "Crustdata.search_companies", durationMs: 240, status: "recovered", paramsSnippet: "headcount: 10..150, stage: Seed..Series B" },
    { id: "tc-2", toolName: "Crustdata.find_decision_makers", durationMs: 180, status: "success", paramsSnippet: "titles: VP Engineering, CTO" },
    { id: "tc-3", toolName: "AWSBedrock.converse (Nova/Claude)", durationMs: 420, status: "success", paramsSnippet: "prompt: outreach_synthesis_v2" },
    { id: "tc-4", toolName: "neatlogs.trace_span.guardrail_verify", durationMs: 95, status: "success", paramsSnippet: "claims: 3 checked, 0 ungrounded" }
  ]
}: ToolChipsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1.5 text-xs">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[#5B6170] hover:text-[#14161C] font-semibold text-[12px] py-1 cursor-pointer w-fit select-none"
      >
        <Wrench className="w-3.5 h-3.5 text-blue-600" />
        <span className="tabular-nums">{toolCalls.length} autonomous tool executions</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            expanded ? "rotate-180 text-slate-800" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="flex flex-col gap-1.5 pt-1 pl-1">
          {toolCalls.map((tc) => (
            <div
              key={tc.id}
              className="flex items-center justify-between bg-[#F5F6FA] border border-slate-200/70 rounded-xl px-2.5 py-1.5"
            >
              <div className="flex items-center gap-2 truncate">
                <Terminal className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] font-semibold text-[#14161C] truncate">
                  {tc.toolName}
                </span>
                {tc.paramsSnippet && (
                  <span className="text-[10px] text-slate-400 truncate hidden md:inline">
                    ({tc.paramsSnippet})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {tc.durationMs && (
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {tc.durationMs}ms
                  </span>
                )}
                <span
                  className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ${
                    tc.status === "recovered"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {tc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
