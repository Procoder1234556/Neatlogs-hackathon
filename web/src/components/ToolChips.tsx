"use client";

import React, { useState } from "react";
import { Terminal, ChevronDown, Check, Wrench, RefreshCw, AlertTriangle, ArrowRight, CornerDownRight } from "lucide-react";

export interface ToolCallItem {
  id: string;
  toolName: string;
  durationMs?: number;
  status: "success" | "running" | "fallback" | "recovered" | "error";
  paramsSnippet?: string;
  resultSnippet?: string;
  endpoint?: string;
}

interface ToolChipsProps {
  toolCalls?: ToolCallItem[];
  defaultExpanded?: boolean;
}

export default function ToolChips({
  toolCalls = [],
  defaultExpanded = true
}: ToolChipsProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const activeTool = toolCalls.find((tc) => tc.status === "running");

  return (
    <div className="w-full flex flex-col gap-2 text-xs">
      {/* Header toggle */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-[#CCCCCC] hover:text-white font-semibold text-[12px] py-1 cursor-pointer select-none"
        >
          <div className="size-6 rounded-lg bg-blue-950/70 border border-blue-700/50 flex items-center justify-center text-blue-400">
            <Wrench className="size-3.5" />
          </div>
          <span className="tabular-nums font-mono">
            {toolCalls.length} autonomous tool executions
          </span>
          <ChevronDown
            className={`size-3.5 text-[#8E8E8E] transition-transform duration-200 ${
              expanded ? "rotate-180 text-white" : ""
            }`}
          />
        </button>

        {activeTool && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-900/60 border border-blue-500/60 text-[10px] text-blue-300 font-medium animate-pulse">
            <RefreshCw className="size-2.5 animate-spin" />
            <span>Executing: {activeTool.toolName}</span>
          </div>
        )}
      </div>

      {expanded && (
        <div className="flex flex-col gap-2 pt-1">
          {toolCalls.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#202020] border border-[#2F2F2F] text-center text-[#7E7E7E] text-[11px]">
              No tool calls executed yet. Start prospecting to stream tool executions.
            </div>
          ) : (
            toolCalls.map((tc) => {
              const isSelected = selectedToolId === tc.id;
              const isRunning = tc.status === "running";

              return (
                <div
                  key={tc.id}
                  className={`flex flex-col rounded-xl border transition-all ${
                    isRunning
                      ? "bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/40"
                      : tc.status === "recovered"
                      ? "bg-amber-950/20 border-amber-800/60"
                      : "bg-[#202020] border-[#2E2E2E] hover:border-[#3E3E3E]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedToolId(isSelected ? null : tc.id)}
                    className="flex items-center justify-between px-3 py-2 text-left cursor-pointer select-none w-full"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="size-5 rounded-md bg-[#2A2A2A] flex items-center justify-center shrink-0">
                        {isRunning ? (
                          <RefreshCw className="size-3 text-blue-400 animate-spin" />
                        ) : (
                          <Terminal className="size-3 text-slate-400" />
                        )}
                      </div>
                      <span className="font-mono text-[11.5px] font-semibold text-white truncate">
                        {tc.toolName}
                      </span>
                      {tc.paramsSnippet && (
                        <span className="text-[10px] text-[#8E8E8E] truncate hidden md:inline font-mono">
                          ({tc.paramsSnippet})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {tc.durationMs !== undefined && (
                        <span className="text-[10px] font-mono text-[#8E8E8E] tabular-nums">
                          {tc.durationMs}ms
                        </span>
                      )}
                      <span
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                          isRunning
                            ? "bg-blue-900/80 text-blue-300 border-blue-600 animate-pulse"
                            : tc.status === "recovered"
                            ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                            : tc.status === "error"
                            ? "bg-rose-950/80 text-rose-300 border-rose-700/60"
                            : "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                        }`}
                      >
                        {tc.status}
                      </span>
                      <ChevronDown
                        className={`size-3 text-[#7E7E7E] transition-transform ${
                          isSelected ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expandable inspector for parameters, endpoint and result */}
                  {isSelected && (
                    <div className="px-3 pb-3 pt-1 border-t border-[#2A2A2A] bg-[#1A1A1A]/70 text-[11px] font-mono space-y-1.5 rounded-b-xl">
                      {tc.paramsSnippet && (
                        <div>
                          <span className="text-[#8E8E8E] block text-[10px]">Input Parameters:</span>
                          <div className="p-1.5 rounded-md bg-[#141414] text-[#CCCCCC] text-[10.5px] border border-[#282828] mt-0.5 break-all">
                            {tc.paramsSnippet}
                          </div>
                        </div>
                      )}
                      {tc.resultSnippet && (
                        <div>
                          <span className="text-[#8E8E8E] block text-[10px]">Returned Output:</span>
                          <div className="p-1.5 rounded-md bg-[#141414] text-emerald-300 text-[10.5px] border border-[#282828] mt-0.5 break-all">
                            {tc.resultSnippet}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
