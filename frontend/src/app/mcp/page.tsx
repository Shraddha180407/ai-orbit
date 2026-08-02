import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { GlobalHero } from "@/components/GlobalHero";
import { Footer } from "@/components/Footer";
import { MCPClient } from "@/components/mcp-client";

export const metadata: Metadata = {
  title: "MCP Servers Directory",
  description:
    "Browse Model Context Protocol (MCP) servers for AI integrations, tools, and extensions.",
};

export default function MCPPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <Header />
      <Suspense fallback={<div className="h-[300px]" />}><GlobalHero /></Suspense>
      <Suspense
        fallback={
          <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex-1">
            <div className="mx-auto w-full max-w-[1600px]">
              <div className="overflow-x-auto rounded-lg border border-[#232326]/60 bg-[#131316]/10">
                <div className="flex flex-col divide-y divide-[#232326]/60">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[40px_minmax(200px,2.4fr)_minmax(120px,1.2fr)_minmax(120px,1.3fr)_minmax(100px,1.1fr)_minmax(90px,0.9fr)_minmax(110px,1.1fr)_minmax(140px,1.5fr)] min-w-[900px] items-center gap-4 px-4 py-2.5"
                    >
                      <div className="h-11 w-11 animate-pulse rounded-lg bg-[#18181C]" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-40 animate-pulse rounded bg-[#18181C]" />
                        <div className="h-2 w-64 animate-pulse rounded bg-[#18181C]" />
                      </div>
                      <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-3 w-20 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-4 w-16 animate-pulse rounded-full bg-[#18181C]" />
                      <div className="h-3 w-12 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-3 w-16 animate-pulse rounded bg-[#18181C]" />
                      <div className="h-4 w-20 animate-pulse rounded-md bg-[#18181C]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <MCPClient />
      </Suspense>
      <Footer />
    </div>
  );
}
