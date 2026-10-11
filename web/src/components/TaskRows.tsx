"use client";

import React, { useState } from "react";
import { Check, ChevronDown, RefreshCw, AlertTriangle, AlertCircle } from "lucide-react";

export interface TaskItem {
  id: string;
  stepNumber?: number;
  title: string;
  subtitle?: string;
  status: "completed" | "running" | "recovered" | "failed" | "pending";
  items?: { label: string; value: string }[];
}

interface TaskRowsProps {
  tasks: TaskItem[];
}

export default function TaskRows({ tasks }: TaskRowsProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {tasks.map((task, idx) => {
        const isOpen = !!openIds[task.id];
        const stepNum = task.stepNumber ?? idx + 1;

        return (
          <div
            key={task.id}
            style={{ borderRadius: "20px" }}
            className={`overflow-hidden transition-all duration-200 border shadow-sm ${
              task.status === "running"
                ? "border-blue-500/80 bg-blue-950/30 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/40"
                : task.status === "recovered"
                ? "border-amber-700/60 bg-amber-950/20"
                : task.status === "failed"
                ? "border-rose-700/60 bg-rose-950/20"
                : "border-[#2D2D2D] bg-[#1E1E1E] hover:border-[#3A3A3A]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(task.id)}
              className="flex h-12 w-full items-center gap-3 px-3.5 text-left select-none cursor-pointer"
            >
              {/* Status Ring / Icon */}
              <span className="flex size-6 shrink-0 items-center justify-center">
                {task.status === "completed" || task.status === "recovered" ? (
                  <span
                    className={`flex size-5.5 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${
                      task.status === "recovered" ? "bg-amber-600" : "bg-emerald-600"
                    }`}
                    style={{ animation: "pop-in 300ms cubic-bezier(0.23,1,0.32,1) both" }}
                  >
                    <Check className="size-3.5 stroke-[3]" />
                  </span>
                ) : task.status === "running" ? (
                  <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
                    <svg className="absolute inset-0 size-6 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" className="opacity-20" />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="18 45"
                      />
                    </svg>
                    <span className="relative text-[10px] font-bold text-blue-300 tabular-nums">
                      {stepNum}
                    </span>
                  </span>
                ) : task.status === "failed" ? (
                  <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
                    <AlertCircle className="size-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full border border-[#404040] text-[#707070] text-[10px] font-bold">
                    {stepNum}
                  </span>
                )}
              </span>

              {/* Title & Subtitle */}
              <div className="min-w-0 flex-1 truncate">
                <span className="text-[13px] font-semibold text-white block truncate">
                  {task.title}
                </span>
              </div>

              {task.subtitle && (
                <span className="text-[11.5px] font-mono text-[#8E8E8E] tabular-nums hidden sm:inline">
                  {task.subtitle}
                </span>
              )}

              {/* Badge */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  task.status === "completed"
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/60"
                    : task.status === "recovered"
                    ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
                    : task.status === "running"
                    ? "bg-blue-900/80 text-blue-200 border-blue-600 animate-pulse"
                    : task.status === "failed"
                    ? "bg-rose-950/80 text-rose-300 border-rose-800/60"
                    : "bg-[#2A2A2A] text-[#707070] border-transparent"
                }`}
              >
                {task.status === "recovered" ? "Recovered" : task.status === "completed" ? "Done" : task.status}
              </span>

              {/* Chevron */}
              <ChevronDown
                className={`size-3.5 text-[#7E7E7E] transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {/* Expandable Details */}
            {isOpen && task.items && task.items.length > 0 && (
              <div className="px-3.5 pb-3 pt-1 border-t border-[#292929] bg-[#171717]/80">
                <div className="flex flex-col gap-1.5 pt-1 text-xs">
                  {task.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11.5px]">
                      <span className="text-[#8E8E8E]">{item.label}</span>
                      <span className="font-mono font-medium text-[#ECECEC] tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
