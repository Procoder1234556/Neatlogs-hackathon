"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from "lucide-react";

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
      title: "Confirm primary search widen parameter if seed yields < 5 leads:",
      options: ["Widen headcount to 10..150", "Add Series B venture rounds", "Include remote worldwide titles"]
    },
    {
      id: "q2",
      title: "Select tone of outreach for technical executives:",
      options: ["Concise peer engineering (default)", "Technical infrastructure teardown", "Brief hiring growth inquiry"]
    },
    {
      id: "q3",
      title: "Set automated recovery budget cap limit:",
      options: ["Standard (max 250 credits)", "Conservative (max 100 credits)", "Aggressive (max 500 credits)"]
    }
  ],
  onApprove,
  onSkip
}: ApprovalCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    q1: "Widen headcount to 10..150",
    q2: "Concise peer engineering (default)",
    q3: "Standard (max 250 credits)"
  });

  const currentQ = questions[currentIdx];

  const handleSelect = (option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
  };

  return (
    <div className="w-full rounded-[24px] bg-white border border-slate-200/90 shadow-sm p-4 text-xs transition-all">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 font-bold text-[#14161C]">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Human-in-the-Loop Guardrail Review</span>
        </div>
        <div className="flex items-center gap-1 text-[#717684] tabular-nums font-medium">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span>
            {currentIdx + 1} / {questions.length}
          </span>
          <button
            type="button"
            disabled={currentIdx === questions.length - 1}
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Question Title */}
      <h4 className="text-[13px] font-semibold text-[#14161C] mb-2.5">
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
                  ? "bg-blue-50/60 border-blue-300 text-blue-900 font-medium"
                  : "bg-[#F5F6FA] border-transparent hover:bg-slate-100 text-[#14161C]"
              }`}
            >
              <span>{opt}</span>
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onSkip}
          className="text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded cursor-pointer"
        >
          Skip
        </button>
        <div className="flex items-center gap-2">
          {currentIdx < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-full cursor-pointer shadow-sm"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApprove && onApprove(selectedAnswers)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-full cursor-pointer shadow-sm"
            >
              Confirm & Launch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
