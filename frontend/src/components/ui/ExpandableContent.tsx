'use client';

import React, { useState, useEffect, useRef } from "react";
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';

interface ExpandableContentProps {
  children: React.ReactNode;
  collapsedContent?: React.ReactNode;
  maxHeight?: number;
  readMoreLabel?: string;
  readLessLabel?: string;
}

export function ExpandableContent({
  children,
  collapsedContent,
  maxHeight = 450,
  readMoreLabel = "Read Full Description",
  readLessLabel = "Show Less"
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collapsedContent) {
      setNeedsCollapse(true);
      return;
    }

    const checkHeight = () => {
      if (contentRef.current) {
        // Add 50px buffer to prevent collapsing if only slightly over
        const hasOverflow = contentRef.current.scrollHeight > maxHeight + 50;
        setNeedsCollapse(hasOverflow);
      }
    };

    // Run check initially
    checkHeight();

    // Recheck on window resize in case of layout shifts
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [children, collapsedContent, maxHeight]);

  const toggleExpand = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative w-full flex flex-col h-full justify-between">
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out w-full"
        style={{
          maxHeight: !collapsedContent && needsCollapse && !isExpanded ? `${maxHeight}px` : "none",
          overflow: !collapsedContent && needsCollapse && !isExpanded ? "hidden" : "visible",
        }}
      >
        {collapsedContent && !isExpanded ? collapsedContent : children}
      </div>

      {!collapsedContent && needsCollapse && !isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#131316] to-transparent pointer-events-none" />
      )}

      {needsCollapse && (
        <div className={`flex shrink-0 ${collapsedContent ? "justify-start mt-2.5 border-t border-[#232326]/40 pt-2" : "justify-center mt-6"}`}>
          <button
            type="button"
            onClick={toggleExpand}
            className={
              collapsedContent
                ? "inline-flex items-center gap-1 text-[11px] font-semibold text-[#6E56CF] hover:text-[#8E76EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] rounded px-1 py-0.5 cursor-pointer"
                : "inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E56CF] hover:text-white bg-[#6E56CF]/5 hover:bg-[#6E56CF] border border-[#6E56CF]/30 hover:border-[#6E56CF] rounded-lg px-4.5 py-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer shadow-md shadow-[#6E56CF]/5"
            }
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? readLessLabel : readMoreLabel}</span>
            {isExpanded ? <ChevronUp size={collapsedContent ? 12 : 14} /> : <ChevronDown size={collapsedContent ? 12 : 14} />}
          </button>
        </div>
      )}
    </div>
  );
}
