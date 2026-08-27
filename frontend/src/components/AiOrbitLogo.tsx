import React from "react";

export function AiOrbitLogo({ className, size }: { className?: string; size?: number | string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={size || "100%"} 
      height={size || "100%"} 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="logo-mask">
          <rect width="100" height="100" fill="white" />
          <circle cx="72" cy="36" r="9" fill="black" />
          <path d="M 12 76 Q 45 45 60 52" stroke="black" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M 32 94 Q 55 70 66 71" stroke="black" strokeWidth="11" strokeLinecap="round" fill="none" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="50" fill="currentColor" mask="url(#logo-mask)" />
    </svg>
  );
}
