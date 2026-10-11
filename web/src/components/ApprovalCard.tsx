"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Check } from "lucide-react";

interface QuestionItem {
  id: string;
  title: string;
  options: string[];
}

interface ApprovalCardProps {
  questions?: QuestionItem[];
  onApprove?: (answers: Record<string, string>) => void;
  onSkip?: () => void;
}

export default function ApprovalCard({
  questions = [
    {
      id: "q1",
      title: "Confirm autonomous recovery protocol if seed yields < 5 leads:",
      options: ["Widen headcount to 10..150 (automated)", "Add Series B venture rounds", "Include remote worldwide titles"]
    },
    {
      id: "q2",
      title: "Select tone of outreach for technical executives:",
      options: ["Concise peer engineering (default)", "Technical infrastructure teardown", "Brief hiring growth inquiry"]
    },
    {
      id: "q3",
      title: "Set automated recovery credit budget cap limit:",
      options: ["Standard (max 250 credits)", "Conservative (max 100 credits)", "Aggressive (max 500 credits)"]
    }
  ],
  onApprove,
  onSkip
}: ApprovalCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    q1: "Widen headcount to 10..150 (automated)",
    q2: "Concise peer engineering (default)",
    q3: "Standard (max 250 credits)"
  });

  const currentQ = questions[currentIdx];

  const handleSelect = (option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
  };

  return (
    <div className="w-full rounded-[24px] bg-[#1E1E1E] border border-[#333333] shadow-md p-4 text-xs transition-all">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2C2C2C]">
        <div className="flex items-center gap-2 font-bold text-white">
          <ShieldCheck className="size-4 text-blue-400" />
          <span>Human-in-the-Loop Guardrail Review</span>
        </div>
        <div className="flex items-center gap-1 text-[#8E8E8E] tabular-nums font-medium">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="p-1 rounded hover:bg-[#2C2C2C] disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span>
            {currentIdx + 1} / {questions.length}
          </span>
          <button
            type="button"
            disabled={currentIdx === questions.length - 1}
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="p-1 rounded hover:bg-[#2C2C2C] disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Question Title */}
      <h4 className="text-[13px] font-semibold text-white mb-2.5">
        {currentQ.title}
      </h4>

      {/* Options */}
      <div className="flex flex-col gap-1.5 mb-4">
        {currentQ.options.map((opt) => {
          const isSelected = selectedAnswers[currentQ.id] === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer border ${
                isSelected
                  ? "bg-blue-950/60 border-blue-500 text-blue-200 font-semibold shadow-sm"
                  : "bg-[#262626] border-[#383838] hover:bg-[#2F2F2F] text-[#CCCCCC]"
              }`}
            >
              <span>{opt}</span>
              {isSelected && <CheckCircle2 className="size-3.5 text-blue-400" />}
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2C2C2C]">
        <button
          type="button"
          onClick={onSkip}
          className="text-[#8E8E8E] hover:text-white font-semibold px-2 py-1 rounded cursor-pointer"
        >
          Skip Review
        </button>
        <div className="flex items-center gap-2">
          {currentIdx < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-full cursor-pointer shadow-sm text-xs"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApprove && onApprove(selectedAnswers)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-full cursor-pointer shadow-sm text-xs flex items-center gap-1.5"
            >
              <Check className="size-3.5" />
              <span>Confirm & Dispatch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
