"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Pause, Play, CheckCircle2, AlertTriangle, AlertCircle, Info, ChevronDown } from "lucide-react";
import { ActivityLogItem } from "../lib/animationRegistry";

interface ActivityFeedProps {
  logs: ActivityLogItem[];
  maxHeight?: string;
}

export default function ActivityFeed({
  logs,
  maxHeight = "240px"
}: ActivityFeedProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const getLevelBadge = (level: ActivityLogItem["level"]) => {
    switch (level) {
      case "success":
        return <CheckCircle2 className="size-3 text-emerald-400 shrink-0 mt-0.5" />;
      case "warning":
        return <AlertTriangle className="size-3 text-amber-400 shrink-0 mt-0.5" />;
      case "error":
        return <AlertCircle className="size-3 text-rose-400 shrink-0 mt-0.5" />;
      case "info":
      default:
        return <Info className="size-3 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#161616] border border-[#2B2B2B] overflow-hidden flex flex-col shadow-inner">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#262626] bg-[#1A1A1A] text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-blue-400" />
          <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
            Live Event Feed
          </span>
          <span className="px-1.5 py-0.2 rounded-md bg-[#242424] text-[10px] text-[#8E8E8E] font-mono tabular-nums">
            {logs.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
              autoScroll
                ? "bg-emerald-950/70 text-emerald-300 border border-emerald-800/50"
                : "bg-[#2A2A2A] text-[#8E8E8E] hover:text-white"
            }`}
            title={autoScroll ? "Pause automatic scroll" : "Resume automatic scroll"}
          >
            {autoScroll ? <Pause className="size-2.5" /> : <Play className="size-2.5" />}
            <span>{autoScroll ? "Live Scroll" : "Paused"}</span>
          </button>
        </div>
      </div>

      {/* Scrolling body */}
      <div
        ref={containerRef}
        style={{ maxHeight }}
        className="overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin text-xs font-mono"
      >
        {logs.length === 0 ? (
          <div className="py-8 text-center text-[#6E6E6E] text-[11px] font-sans">
            Awaiting live telemetry events from autonomous agent...
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="animate-feed-entry flex items-start gap-2 px-2 py-1 rounded-lg hover:bg-[#202020] transition-colors text-[11px] leading-relaxed text-[#D6D6D6]"
            >
              <span className="text-[#686868] shrink-0 tabular-nums">
                {log.timestamp}
              </span>
              {getLevelBadge(log.level)}
              <span className="text-blue-400 font-semibold shrink-0">
                [{log.agent}]
              </span>
              <span className="break-words flex-1 text-[#CCCCCC]">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
