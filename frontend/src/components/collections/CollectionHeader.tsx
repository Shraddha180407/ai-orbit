'use client';

import React from "react";

export function CollectionsHeader() {
  return (
    <section
      className="relative w-full flex flex-col items-center pt-4 pb-6 px-6"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* Ambient signal glow matching the homepage */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
        style={{ backgroundColor: 'var(--color-signal)' }}
      />

      <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
        {/* Title matching exact homepage hero heading styles */}
        <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 select-none text-white text-balance">
          Collections
        </h1>

        {/* Subtitle / paragraph styled to fit the hero theme */}
        <p className="max-w-[520px] text-[13px] sm:text-[15px] font-normal text-[#71717A] text-balance leading-relaxed">
          Discover curated collections of AI tools, models and companies
          for every workflow.
        </p>
      </div>
    </section>
  );
}