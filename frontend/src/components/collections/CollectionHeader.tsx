"use client";

import React from "react";

export function CollectionsHeader() {
  return (
    <section className="relative w-full flex flex-col items-center pt-10 pb-8 px-6 overflow-hidden">
      {/* Ambient signal glow, matching the devices page hero */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full blur-[120px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #6E56CF 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-4 left-1/3 w-[400px] h-[200px] rounded-full blur-[100px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #7C66DF 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-4 right-1/3 w-[400px] h-[200px] rounded-full blur-[100px] opacity-20"
        style={{ background: "radial-gradient(ellipse, #5B45B8 0%, transparent 70%)" }}
      />

      {/* Subtle grid backdrop, kept from the original */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(35, 35, 38, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] w-full flex flex-col items-center text-center">
        <h1 className="max-w-[820px] text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-3 select-none text-balance">
          Collections
        </h1>
        <p className="max-w-[520px] text-[#71717A] text-xs md:text-sm leading-relaxed text-balance">
          Discover curated collections of AI tools, models and companies for every workflow.
        </p>
      </div>
    </section>
  );
}