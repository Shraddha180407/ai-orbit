'use client';

import React, { useState, useEffect, useRef } from "react";
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';
import Zap from 'lucide-react/dist/esm/icons/zap';
import type { MCPFeature } from "@/lib/types";

// Helper: formats raw feature identifiers into clean Title Case
function formatFeatureTitle(title: string): string {
  let name = title;
  name = name.replace(/^(niche_|mcp_|tool_|smithery_)/i, "");
  name = name.replace(/[_-]/g, " ");
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper: extracts first sentence preview of the description (concise summary)
function getFeaturePreview(description: string): string {
  const cleanText = description
    .replace(/[*_`~]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ");

  const sentenceEnd = cleanText.search(/[.!?](?:\s|$)/);
  let preview = sentenceEnd !== -1 ? cleanText.slice(0, sentenceEnd + 1) : cleanText;

  if (preview.length > 150) {
    const truncated = preview.slice(0, 150);
    const lastSpace = truncated.lastIndexOf(" ");
    preview = lastSpace > 50 ? truncated.slice(0, lastSpace) + "..." : truncated + "...";
  }
  return preview.trim();
}

export default function KeyFeatureCard({ feature }: { feature: MCPFeature }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [maxHeight, setMaxHeight] = useState("4.5rem"); // 3 lines collapsed height (4.5rem)
  
  const descriptionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const readableTitle = formatFeatureTitle(feature.title);
  const previewText = feature.description ? getFeaturePreview(feature.description) : "";

  // Truncation detection using ResizeObserver on the description element
  useEffect(() => {
    const descriptionEl = descriptionRef.current;
    if (!descriptionEl) return;

    const observer = new ResizeObserver(() => {
      // Determine expandability only when collapsed. When expanded, clientHeight equals scrollHeight
      // and we lock the isExpandable status so the button does not disappear.
      if (!isExpanded && descriptionEl) {
        const hasOverflow = descriptionEl.scrollHeight > descriptionEl.clientHeight;
        setIsExpandable(hasOverflow);
      }
    });

    observer.observe(descriptionEl);
    return () => {
      observer.disconnect();
    };
  }, [isExpanded, feature.description]);

  // Handle smooth transition of max-height for text expansion
  useEffect(() => {
    if (isExpanded && textRef.current) {
      setMaxHeight(`${textRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("4.5rem");
    }
  }, [isExpanded, feature.description]);

  const buttonClass = "inline-flex items-center gap-1 text-[11px] font-semibold text-[#6E56CF] hover:text-[#8E76EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] rounded px-1 py-0.5 cursor-pointer";

  return (
    <div className="flex h-full gap-3 rounded-lg border border-[#232326]/60 bg-[#131316]/20 p-4">
      {/* Icon Column */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#18181C] text-[#6E56CF]">
        <Zap size={16} />
      </div>

      {/* Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Title & Description Block */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-1">{readableTitle}</h4>
          {feature.description && (
            <div
              ref={descriptionRef}
              id={`feature-desc-${feature.id}`}
              className="transition-all duration-300 ease-in-out overflow-hidden"
              style={{ maxHeight }}
            >
              <p ref={textRef} className="text-xs text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                {isExpandable && !isExpanded ? previewText : feature.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer Area (mt-auto) */}
        <div className="mt-auto w-full pt-3 border-t border-[#232326]/40 mt-3.5 flex flex-col">
          <div className="flex items-center">
            {isExpandable ? (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={`feature-desc-${feature.id}`}
                className={buttonClass}
              >
                <span>{isExpanded ? "Read Less" : "Read More"}</span>
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            ) : (
              <span
                aria-hidden="true"
                className={`${buttonClass} invisible select-none pointer-events-none`}
              >
                <span>Read More</span>
                <ChevronDown size={12} />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
