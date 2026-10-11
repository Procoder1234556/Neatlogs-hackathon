"use client";

import React, { useState } from "react";
import { Copy, Check, RotateCw, ThumbsUp, ThumbsDown, Database, ExternalLink } from "lucide-react";

interface SourceItem {
  name: string;
  url?: string;
  domain?: string;
}

interface StreamingTextProps {
  text: string;
  isStreaming?: boolean;
  sources?: SourceItem[];
  onRetry?: () => void;
}

export default function StreamingText({
  text,
  isStreaming = false,
  sources = [
    { name: "Crustdata Graph", domain: "api.crustdata.com" },
    { name: "neatlogs Trace", domain: "app.neatlogs.com" },
    { name: "AWS Bedrock Nova/Claude", domain: "aws.amazon.com" }
  ],
  onRetry
}: StreamingTextProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Streamed Body */}
      <div className="text-[13px] leading-relaxed text-[#14161C] whitespace-pre-wrap font-sans">
        {text}
        {isStreaming && (
          <span
            className="ml-1 inline-block h-3.5 w-1 translate-y-0.5 rounded-full bg-blue-600 animate-pulse"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Source badges & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Source Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-[#717684]">Verified Sources:</span>
          {sources.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#F5F6FA] hover:bg-slate-200/60 border border-slate-200/60 px-2 py-0.5 rounded-full text-[11px] font-medium text-[#14161C] transition-colors"
            >
              <Database className="w-2.5 h-2.5 text-blue-600" />
              <span>{s.name}</span>
            </span>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy text"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              title="Regenerate"
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setFeedback(feedback === "up" ? null : "up")}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              feedback === "up" ? "text-emerald-600 bg-emerald-50" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setFeedback(feedback === "down" ? null : "down")}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              feedback === "down" ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
