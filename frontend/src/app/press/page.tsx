"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Mail,
  ExternalLink,
  X,
  FileText,
  Award,
  Download,
  Sparkles,
  Camera,
} from "lucide-react";

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

  // Handler for asset download buttons (functional simulation)
  const handleAssetDownload = (assetType: string) => {
    alert(`Downloading ${assetType}... Package download will start shortly.`);
  };

  return (
    <div className="flex-1 bg-black text-white font-sans selection:bg-white/35 py-10 px-6 sm:px-10 max-w-4xl mx-auto space-y-10">
      {/* 1. Press & Media Hero */}
      <div className="border-b border-zinc-800/80 pb-6 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-purple-400">
          <Sparkles size={12} className="text-purple-400" />
          PRESS & MEDIA
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          AI Orbit Press Room
        </h1>
        <p className="text-sm sm:text-base text-purple-300 font-semibold">
          The Home of Everything AI.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
          AI Orbit is a discovery platform for the global AI ecosystem,
          helping people discover and understand the tools, companies,
          models, agents, technologies, and trends shaping artificial
          intelligence.
        </p>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono">
          Press Contact:{" "}
          <a
            href="mailto:ceo@aiorbit.club"
            className="text-white hover:underline"
          >
            ceo@aiorbit.club
          </a>
        </p>
      </div>

      {/* 2. What is AI Orbit */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">
          What is AI Orbit?
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          AI Orbit brings the rapidly evolving world of AI into one place.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          From AI tools and agents to companies, models, robots, devices,
          open-source projects, MCP, news, videos, trends, and comparisons,
          AI Orbit makes it easier to discover what's being built across
          artificial intelligence.
        </p>
        <p className="text-sm sm:text-base text-white font-medium">
          Our mission is simple: make AI easier to discover.
        </p>
      </div>

      {/* 3. Why AI Orbit */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">
          Why AI Orbit?
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          The AI ecosystem is growing faster and becoming harder to navigate.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          AI Orbit brings the products, companies, technologies, and ideas
          shaping AI together in one place, giving people a simpler way to
          discover what's out there.
        </p>
      </div>

      {/* 4. For Media */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-3">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">
          For Media
        </h2>
        <p className="text-sm sm:text-base text-white font-medium">
          Covering AI? Start here.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          AI Orbit is a resource for discovering AI products, companies,
          technologies, and emerging trends.
        </p>
        <p className="text-xs sm:text-sm text-zinc-400">
          For interviews, press inquiries, collaborations, or product
          information:
        </p>
        <a
          href="mailto:ceo@aiorbit.club"
          className="inline-flex items-center gap-2 bg-white text-black px-4.5 py-2 rounded-xl font-semibold hover:bg-zinc-200 transition-colors text-xs sm:text-sm shadow-sm"
        >
          Contact Press <ArrowRight size={14} />
        </a>
      </div>

      {/* 5. Latest Announcements (Top-Down Flow, No Side-by-Side Boxes) */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">
          Latest Announcements
        </h2>

        {loading ? (
          <div className="text-xs text-zinc-400 py-4 font-mono">
            Loading announcements...
          </div>
        ) : pressReleases.length === 0 ? (
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 text-xs text-zinc-400 font-mono">
            No announcements available yet.
          </div>
        ) : (
          <div className="space-y-3">
            {pressReleases.map((item: any) => (
              <div
                key={item.id}
                onClick={() => setSelectedPress(item)}
                className="group p-5 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span className="text-zinc-300 font-medium">{item.tag}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-1 flex items-center gap-1 text-xs font-medium text-zinc-300 group-hover:text-white">
                  Read announcement <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Brand Assets */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-purple-400">
          Brand Assets
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400">
          Official AI Orbit assets for editorial and approved media use.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col justify-between p-5 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
                  <FileText size={18} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                  SVG / PNG
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Logo & Marks
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Official AI Orbit logos and brand marks.
              </p>
            </div>
            <a
              href="/logo-full.png"
              download="AI-Orbit-Logo.png"
              className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold transition-colors border border-white/10 flex items-center justify-center gap-1"
            >
              Download Logo <ArrowRight size={12} />
            </a>
          </div>

          <div className="flex flex-col justify-between p-5 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
                  <Award size={18} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                  PDF
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Brand Guidelines
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Typography, colors, and logo usage.
              </p>
            </div>
            <button
              onClick={() => handleAssetDownload("Brand Guidelines")}
              className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold transition-colors border border-white/10 flex items-center justify-center gap-1"
            >
              View Guidelines <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex flex-col justify-between p-5 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
                  <Camera size={18} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                  ZIP
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Screenshots
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                AI Orbit product visuals for editorial use.
              </p>
            </div>
            <button
              onClick={() => handleAssetDownload("Screenshots")}
              className="mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold transition-colors border border-white/10 flex items-center justify-center gap-1"
            >
              Download Screenshots <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Closing CTA */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-3 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Built for Discovery.
        </h2>
        <p className="text-sm sm:text-base text-zinc-300">
          One place to explore the evolving world of AI.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-white text-black px-4.5 py-2 rounded-xl font-semibold hover:bg-zinc-200 transition-colors text-xs sm:text-sm shadow-sm"
        >
          Explore AI Orbit <ArrowRight size={14} />
        </a>
      </div>

      {/* 8. Footer */}
      <div className="pt-4 border-t border-zinc-800/80 space-y-2">
        <div className="text-xs text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} AI Orbit. All rights reserved.
          </span>
          <a
            href="mailto:ceo@aiorbit.club"
            className="hover:text-white transition-colors font-mono"
          >
            ceo@aiorbit.club
          </a>
        </div>
      </div>

      {/* Modal Popup for Announcement Details */}
      {selectedPress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedPress(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>{selectedPress.date}</span>
              <span>•</span>
              <span className="text-zinc-300 font-medium">
                {selectedPress.tag}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white leading-snug">
              {selectedPress.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
              {selectedPress.description}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPress(null)}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}