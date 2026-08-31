"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, X, Download, Palette, Camera, Sparkles } from "lucide-react";
import Link from "next/link";

function OrbitDiagram() {
  const nodes = [
    { label: "Tools", angle: -20, r: 108 },
    { label: "Models", angle: 60, r: 108 },
    { label: "Companies", angle: 150, r: 108 },
    { label: "Agents", angle: 230, r: 108 },
    { label: "MCP", angle: 320, r: 108 },
  ];

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[320px] mx-auto">
      <circle cx="160" cy="160" r="108" fill="none" stroke="#27272a" strokeWidth="1" />
      <circle cx="160" cy="160" r="72" fill="none" stroke="#27272a" strokeWidth="1" />
      <circle
        cx="160"
        cy="160"
        r="108"
        fill="none"
        stroke="#c084fc"
        strokeWidth="1"
        strokeDasharray="2 6"
        className="origin-center animate-[spin_40s_linear_infinite]"
      />
      <circle cx="160" cy="160" r="5" fill="#c084fc" />
      <text
        x="160"
        y="145"
        textAnchor="middle"
        className="fill-white font-bold"
        style={{ fontSize: 13 }}
      >
        AI Orbit
      </text>

      {nodes.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = 160 + n.r * Math.cos(rad);
        const y = 160 + n.r * Math.sin(rad);
        return (
          <g key={i}>
            <line
              x1="160"
              y1="160"
              x2={x}
              y2={y}
              stroke="#27272a"
              strokeWidth="1"
            />
            <circle cx={x} cy={y} r="4" fill="#818cf8" />
            <text
              x={x}
              y={y - 12}
              textAnchor="middle"
              className="fill-zinc-400 font-mono text-[10px]"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function PressPage() {
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPress, setSelectedPress] = useState<any>(null);

  useEffect(() => {
    async function fetchPress() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
        const res = await fetch(`${apiUrl}/api/press`);
        const json = await res.json();
        if (json.success) {
          setPressReleases(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch press releases from database", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPress();
  }, []);

  const handleAssetDownload = (assetType: string) => {
    alert(`Downloading ${assetType}... Package download will start shortly.`);
  };

  return (
    <div className="flex-1 bg-black text-white font-sans selection:bg-purple-500/30 min-h-screen relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Masthead */}
        <div className="flex items-center justify-between py-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <span className="font-bold tracking-tight text-white">AI Orbit</span>
          </div>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Explore AI Orbit
          </Link>
        </div>

        {/* Hero — headline + orbit diagram */}
        <div className="grid sm:grid-cols-[1.2fr_1fr] gap-10 items-center py-14 border-b border-zinc-800/80">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono tracking-wider uppercase text-purple-400">
              <Sparkles size={12} className="text-purple-400 animate-pulse" />
              PRESS ROOM
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              In the <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">Spotlight</span>
            </h1>
            <p className="text-purple-300 font-semibold text-lg">
              The home of everything AI.
            </p>
            <p className="text-zinc-300 leading-relaxed max-w-[56ch]">
              AI Orbit is a discovery platform for the global AI ecosystem,
              helping people discover and understand the tools, companies,
              models, agents, technologies, and trends shaping artificial
              intelligence.
            </p>
            <p className="text-sm text-zinc-400 font-mono">
              Press contact —{" "}
              <a
                href="mailto:ceo@aiorbit.club"
                className="text-purple-300 hover:text-white hover:underline transition-colors font-semibold"
              >
                ceo@aiorbit.club
              </a>
            </p>
          </div>
          <OrbitDiagram />
        </div>

        <div className="py-14 space-y-14">
          {/* What / Why — editorial two-column */}
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-0 sm:divide-x sm:divide-zinc-800/80">
            <div className="space-y-3 sm:pr-8">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">What is AI Orbit?</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                AI Orbit brings the rapidly evolving world of AI into one
                place. From AI tools and agents to companies, models,
                robots, devices, open-source projects, MCP, news, videos,
                trends, and comparisons, AI Orbit makes it easier to
                discover what's being built across artificial intelligence.
              </p>
              <p className="text-sm text-white font-medium">
                Our mission is simple: make AI easier to discover.
              </p>
            </div>
            <div className="space-y-3 sm:pl-8">
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">Why AI Orbit?</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                The AI ecosystem is growing faster and becoming harder to
                navigate. AI Orbit brings the products, companies,
                technologies, and ideas shaping AI together in one place,
                giving people a simpler way to discover what's out there.
              </p>
            </div>
          </div>

          {/* For Media */}
          <div className="border-l-2 border-purple-500 pl-6 py-1 space-y-3 bg-gradient-to-r from-purple-950/20 via-transparent to-transparent rounded-r-2xl">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">For media</h2>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-[56ch]">
              Covering AI? Start here. AI Orbit is a resource for
              discovering AI products, companies, technologies, and
              emerging trends. For interviews, press inquiries,
              collaborations, or product information:
            </p>
            <a
              href="mailto:ceo@aiorbit.club"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-white hover:gap-2.5 transition-all"
            >
              Contact press <ArrowRight size={14} />
            </a>
          </div>

          {/* Latest Announcements — manifest/log style */}
          <div className="space-y-5">
            <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">Latest announcements</h2>

            {loading ? (
              <p className="text-sm text-zinc-500 font-mono">Loading announcements…</p>
            ) : pressReleases.length === 0 ? (
              <p className="text-sm text-zinc-500 font-mono">
                No announcements available yet.
              </p>
            ) : (
              <div className="divide-y divide-zinc-800/80 border-t border-b border-zinc-800/80">
                {pressReleases.map((item: any, i: number) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPress(item)}
                    className="group w-full text-left py-5 flex items-start gap-4 hover:bg-zinc-950/60 transition-colors -mx-2 px-2 rounded-xl"
                  >
                    <span className="font-mono text-xs text-zinc-500 pt-1 w-14 shrink-0">
                      №{String(i + 1).padStart(3, "0")}
                    </span>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                        <span>{item.date}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span className="text-purple-300">{item.tag}</span>
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-300 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all mt-1.5 shrink-0"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brand Assets — register list, not cards */}
          <div className="space-y-5">
            <div>
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">Brand assets</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Official AI Orbit assets for editorial and approved media
                use.
              </p>
            </div>

            <div className="divide-y divide-zinc-800/80 border-t border-b border-zinc-800/80">
              <div className="py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Download size={14} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">Logo &amp; marks</h3>
                  <p className="text-xs text-zinc-400">
                    Official AI Orbit logos and brand marks
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-500 shrink-0">
                  PNG
                </span>
                <a
                  href="/logo-full.png"
                  download="AI-Orbit-Logo.png"
                  className="text-sm text-purple-400 hover:text-white hover:underline shrink-0 font-medium"
                >
                  Download
                </a>
              </div>

              <div className="py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Palette size={14} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">Brand guidelines</h3>
                  <p className="text-xs text-zinc-400">
                    Typography, colors, and logo usage
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-500 shrink-0">
                  PDF
                </span>
                <button
                  onClick={() => handleAssetDownload("Brand Guidelines")}
                  className="text-sm text-purple-400 hover:text-white hover:underline shrink-0 font-medium"
                >
                  View
                </button>
              </div>

              <div className="py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Camera size={14} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">Screenshots</h3>
                  <p className="text-xs text-zinc-400">
                    AI Orbit product visuals for editorial use
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-500 shrink-0">
                  ZIP
                </span>
                <button
                  onClick={() => handleAssetDownload("Screenshots")}
                  className="text-sm text-purple-400 hover:text-white hover:underline shrink-0 font-medium"
                >
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Closing CTA */}
          <div className="text-center py-10 border-t border-zinc-800/80 space-y-3">
            <h2 className="text-2xl font-bold text-white">Built for discovery.</h2>
            <p className="text-sm text-zinc-400">
              One place to explore the evolving world of AI.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-white hover:gap-2.5 transition-all pt-1"
            >
              Explore AI Orbit <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-500 font-mono">
          <span>© {new Date().getFullYear()} AI Orbit. All rights reserved.</span>
          <a
            href="mailto:ceo@aiorbit.club"
            className="hover:text-zinc-300 transition-colors"
          >
            ceo@aiorbit.club
          </a>
        </div>
      </div>

      {/* Modal */}
      {selectedPress && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setSelectedPress(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-7 space-y-4 shadow-2xl"
          >
            <button
              onClick={() => setSelectedPress(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors p-2 rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>{selectedPress.date}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-purple-300">{selectedPress.tag}</span>
            </div>

            <h2 className="text-xl font-bold leading-snug pr-6 text-white">
              {selectedPress.title}
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
              {selectedPress.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}