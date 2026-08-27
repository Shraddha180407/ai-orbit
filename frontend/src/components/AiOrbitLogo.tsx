import React from "react";
import Image from "next/image";

export function AiOrbitLogo({ className, size = 32 }: { className?: string; size?: number | string }) {
  // If size is 'auto', we rely entirely on Tailwind classes (like h-10 sm:h-14) passed via className.
  const isAuto = size === 'auto';
  const numSize = isAuto ? 100 : (typeof size === "string" ? parseInt(size, 10) || 32 : size);

  return (
    <Image
      src="/logo-full.png"
      alt="AI Orbit Logo"
      width={numSize * 4}
      height={numSize}
      style={isAuto ? { width: "auto" } : { height: numSize, width: "auto" }}
      className={`w-auto object-contain ${className || ""}`}
      unoptimized
      priority={true}
    />
  );
}

