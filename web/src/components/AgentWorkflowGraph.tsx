"use client";

import React from "react";
import { Check, Clock, AlertTriangle, ArrowRight, Sparkles, Database, ShieldCheck, Mail, Users, Compass } from "lucide-react";

export interface WorkflowNode {
  id: string;
  name: string;
  role: string;
  tool: string;
  status: "pending" | "active" | "completed" | "recovered" | "failed";
  durationMs?: number;
  detail?: string;
}

interface AgentWorkflowGraphProps {
  nodes: WorkflowNode[];
  activeStepId?: string;
}

export default function AgentWorkflowGraph({
  nodes,
  activeStepId
}: AgentWorkflowGraphProps) {
  const getNodeIcon = (nodeId: string) => {
    switch (nodeId) {
      case "plan":
        return <Sparkles className="size-3.5" />;
      case "research":
        return <Database className="size-3.5" />;
      case "recovery":
        return <AlertTriangle className="size-3.5" />;
      case "enrich":
        return <Users className="size-3.5" />;
      case "score":
        return <Compass className="size-3.5" />;
      case "write":
      case "verify":
        return <ShieldCheck className="size-3.5" />;
      default:
        return <Check className="size-3.5" />;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#181818] border border-[#2B2B2B] p-3.5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Execution Flowchart & Pipeline Graph
          </span>
        </div>
        <span className="text-[11px] text-[#8E8E8E] font-medium">
          Sequential Event-Driven Pipeline
        </span>
      </div>

      {/* Grid of sequential pipeline nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {nodes.map((node, idx) => {
          const isActive = node.status === "active" || activeStepId === node.id;
          const isDone = node.status === "completed";
          const isRecovered = node.status === "recovered";
          const isFailed = node.status === "failed";

          return (
            <div
              key={node.id}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? "bg-blue-950/40 border-blue-500/80 shadow-md shadow-blue-500/20 ring-1 ring-blue-400"
                  : isRecovered
                  ? "bg-amber-950/30 border-amber-500/60 text-amber-200"
                  : isDone
                  ? "bg-[#212121] border-[#333333] hover:border-slate-600"
                  : isFailed
                  ? "bg-rose-950/30 border-rose-500/60"
                  : "bg-[#1A1A1A] border-[#262626] opacity-60"
              }`}
            >
              {/* Active animated indicator banner */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 animate-pulse"
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`size-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/40 animate-radar"
                        : isRecovered
                        ? "bg-amber-600 text-white"
                        : isDone
                        ? "bg-emerald-600/90 text-white"
                        : isFailed
                        ? "bg-rose-600 text-white"
                        : "bg-[#282828] text-[#707070]"
                    }`}
                  >
                    {getNodeIcon(node.id)}
                  </div>

                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? "bg-blue-900/80 text-blue-300 border border-blue-700/60"
                        : isRecovered
                        ? "bg-amber-900/80 text-amber-300"
                        : isDone
                        ? "bg-emerald-950 text-emerald-400"
                        : isFailed
                        ? "bg-rose-950 text-rose-400"
                        : "text-[#707070]"
                    }`}
                  >
                    {isRecovered ? "Recovered" : isDone ? "Done" : isActive ? "Active" : "Queued"}
                  </span>
                </div>

                <div className="font-semibold text-xs text-white truncate">
                  {node.name}
                </div>
                <div className="text-[10px] text-blue-400 font-mono truncate mt-0.5">
                  {node.tool}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-[#2B2B2B] flex items-center justify-between text-[10px] text-[#8E8E8E]">
                <span>{node.role}</span>
                {node.durationMs && (
                  <span className="font-mono tabular-nums text-slate-300">
                    {node.durationMs}ms
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
