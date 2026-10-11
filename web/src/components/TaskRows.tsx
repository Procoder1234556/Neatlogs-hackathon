"use client";

import React, { useState } from "react";
import { Check, ChevronDown, RotateCw, AlertTriangle } from "lucide-react";

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
    <div className="flex flex-col gap-2.5 w-full">
      {tasks.map((task, idx) => {
        const isOpen = !!openIds[task.id];
        const stepNum = task.stepNumber ?? idx + 1;

        return (
          <div
            key={task.id}
            style={{ borderRadius: "22px" }}
            className={`overflow-hidden transition-all duration-200 border bg-white shadow-sm hover:shadow ${
              task.status === "running"
                ? "border-blue-200 bg-blue-50/20"
                : task.status === "recovered"
                ? "border-amber-200 bg-amber-50/30"
                : "border-slate-100"
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
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : task.status === "running" ? (
                  <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
                    <svg className="absolute inset-0 size-6 animate-spin text-blue-600" viewBox="0 0 24 24" fill="none">
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
                    <span className="relative text-[10px] font-bold text-blue-700 tabular-nums">
                      {stepNum}
                    </span>
                  </span>
                ) : (
                  <span className="flex size-5.5 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 text-[10px] font-bold">
                    {stepNum}
                  </span>
                )}
              </span>

              {/* Title & Subtitle */}
              <div className="min-w-0 flex-1 truncate">
                <span className="text-[13px] font-semibold text-[#14161C] block truncate">
                  {task.title}
                </span>
              </div>

              {task.subtitle && (
                <span className="text-[12px] font-medium text-[#5B6170] tabular-nums hidden sm:inline">
                  {task.subtitle}
                </span>
              )}

              {/* Badge */}
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  task.status === "completed"
                    ? "bg-emerald-50 text-emerald-700"
                    : task.status === "recovered"
                    ? "bg-amber-100 text-amber-800"
                    : task.status === "running"
                    ? "bg-blue-50 text-blue-700 animate-pulse"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {task.status === "recovered" ? "Recovered" : task.status === "completed" ? "Completed" : task.status}
              </span>

              {/* Chevron */}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-slate-700" : ""
                }`}
              />
            </button>

            {/* Expandable Details */}
            {isOpen && task.items && task.items.length > 0 && (
              <div className="px-3.5 pb-3 pt-1 border-t border-slate-100/80 bg-slate-50/50">
                <div className="flex flex-col gap-1.5 pt-1 text-xs">
                  {task.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[12px]">
                      <span className="text-[#5B6170]">{item.label}</span>
                      <span className="font-mono font-medium text-[#14161C] tabular-nums">{item.value}</span>
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
