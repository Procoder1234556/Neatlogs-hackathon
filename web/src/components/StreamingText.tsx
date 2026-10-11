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
    <div className="w-full flex flex-col gap-3">
      {/* Streamed Body */}
      <div className="text-[13px] leading-relaxed text-[#ECECEC] whitespace-pre-wrap font-sans">
        {text}
        {isStreaming && (
          <span
            className="ml-1 inline-block h-4 w-1.5 translate-y-0.5 rounded-full bg-blue-400 animate-pulse"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Source badges & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2C2C2C] text-xs">
        {/* Source Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-[#8E8E8E]">Verified Ground-Truth Sources:</span>
          {sources.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#242424] hover:bg-[#2C2C2C] border border-[#333333] px-2 py-0.5 rounded-full text-[11px] font-medium text-[#CCCCCC] transition-colors"
            >
              <Database className="size-2.5 text-blue-400" />
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
            className="p-1 rounded-md text-[#8E8E8E] hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          </button>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              title="Regenerate"
              className="p-1 rounded-md text-[#8E8E8E] hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer"
            >
              <RotateCw className="size-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setFeedback(feedback === "up" ? null : "up")}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              feedback === "up" ? "text-emerald-400 bg-emerald-950/70" : "text-[#8E8E8E] hover:text-white hover:bg-[#2A2A2A]"
            }`}
          >
            <ThumbsUp className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setFeedback(feedback === "down" ? null : "down")}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              feedback === "down" ? "text-rose-400 bg-rose-950/70" : "text-[#8E8E8E] hover:text-white hover:bg-[#2A2A2A]"
            }`}
          >
            <ThumbsDown className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
