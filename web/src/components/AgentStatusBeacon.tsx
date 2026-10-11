"use client";

import React from "react";
import { Sparkles, Brain, Check, AlertCircle, Clock, Zap, PauseCircle } from "lucide-react";
import { AgentLifecycleState, ANIMATION_REGISTRY } from "../lib/animationRegistry";

interface AgentStatusBeaconProps {
  state: AgentLifecycleState;
  activeAgentName?: string;
  detail?: string;
  compact?: boolean;
}

export default function AgentStatusBeacon({
  state,
  activeAgentName = "ProspectForge Orchestrator",
  detail,
  compact = false
}: AgentStatusBeaconProps) {
  const spec = ANIMATION_REGISTRY[state] || ANIMATION_REGISTRY.idle;

  // Visual status beacon rendering
  const renderIndicator = () => {
    switch (state) {
      case "thinking":
        return (
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-indigo-500 shadow-md shadow-indigo-500/50" />
          </span>
        );
      case "planning":
        return (
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-cyan-500 shadow-md shadow-cyan-500/50" />
          </span>
        );
      case "tool_execution":
      case "request_received":
        return (
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-blue-500 shadow-md shadow-blue-500/50" />
          </span>
        );
      case "waiting":
        return (
          <span className="size-3 rounded-full bg-amber-400/80 border border-amber-300" />
        );
      case "evaluating":
        return (
          <span className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-purple-500" />
          </span>
        );
      case "completed":
        return (
          <span className="size-3 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
            <Check className="size-2 stroke-[3]" />
          </span>
        );
      case "failed":
        return (
          <span className="size-3 rounded-full bg-rose-500 flex items-center justify-center text-white">
            <AlertCircle className="size-2 stroke-[3]" />
          </span>
        );
      case "idle":
      default:
        return <span className="size-2.5 rounded-full bg-slate-500/60" />;
    }
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium ${spec.badgeColor}`}>
        {renderIndicator()}
        <span className="font-semibold">{spec.label}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] transition-all ${spec.cssClass}`}>
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-xl bg-[#242424] border border-[#333333] flex items-center justify-center text-white shadow-sm shrink-0">
          {state === "thinking" ? (
            <Sparkles className="size-4 text-indigo-400 animate-pulse" />
          ) : state === "planning" ? (
            <Brain className="size-4 text-cyan-400 animate-pulse" />
          ) : state === "completed" ? (
            <Check className="size-4 text-emerald-400" />
          ) : state === "failed" ? (
            <AlertCircle className="size-4 text-rose-400" />
          ) : (
            <Zap className="size-4 text-blue-400" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white tracking-tight">
              {activeAgentName}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${spec.badgeColor}`}>
              {spec.label}
            </span>
          </div>
          <p className="text-[11px] text-[#8E8E8E] mt-0.5">
            {detail || spec.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pr-1">
        {renderIndicator()}
      </div>
    </div>
  );
}
