"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Newspaper,
  Download,
  Mail,
  FileText,
  Megaphone,
  Globe,
  Award,
  X
} from "lucide-react";

export default function PressPage() {
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPress, setSelectedPress] = useState<any>(null); // State for the modal popup

  useEffect(() => {
    async function fetchPress() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
        const res = await fetch(`${apiUrl}/api/press`);
        const json = await res.json();
        if (json.success) {
          setPressReleases(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch press releases", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPress();
  }, []);

  return (
    <div className="flex-1 bg-black text-white font-sans selection:bg-white/30 pt-4 sm:pt-6 pb-2 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div className="w-full lg:w-3/5">
            <div className="mb-2 sm:mb-3 flex items-center gap-4">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                PRESS & MEDIA
              </h2>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3 leading-[1.1]">
              News, Stories &<br />Brand Assets.
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed text-[#e4e4e7] mb-2 sm:mb-3 max-w-[700px]">
              Welcome to the AI Orbit press room. Here you will find official media announcements, product milestone updates, high-resolution brand guidelines, and direct contact channels for journalists and creators.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-[#a1a1aa] mb-3 sm:mb-4 max-w-[700px]">
              Covering the ecosystem? We are happy to provide insights, founder quotes, and exclusive data on AI trends.
            </p>

            <a
              href="mailto:press@aiorbit.club"
              className="inline-flex items-center justify-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors group text-[11px] sm:text-xs"
            >
              Contact Press Team
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="w-full lg:w-2/5 justify-end hidden md:flex">
            <div className="relative w-full max-w-[380px] aspect-square rounded-full flex items-center justify-center border border-[#27272a] bg-[#0a0a0a]">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1a1a1a] to-[#27272a] rounded-full opacity-60"></div>
              <div className="absolute w-[120%] h-[40%] border border-white/15 rounded-[100%] rotate-45"></div>
              <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-black via-[#111] to-[#222] rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(255,255,255,0.05)]">
                <Megaphone size={48} className="text-white/80" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 border-t border-b border-[#27272a] mb-8 bg-[#0a0a0a] rounded-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">10K+</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">Verified AI Tools</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">50K+</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">Monthly Explorers</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">Global</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">Ecosystem Reach</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">Real-Time</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">Ecosystem Tracking</div>
          </div>
        </div>

        {/* Press Releases Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-bold mb-1">Press Releases & Announcements</h2>
            <p className="text-[#a1a1aa] text-xs md:text-sm">Official updates and milestone announcements from AI Orbit.</p>
          </div>

          {loading ? (
            <div className="text-xs text-[#a1a1aa]">Loading press releases...</div>
          ) : pressReleases.length === 0 ? (
            <div className="text-xs text-[#a1a1aa]">No press releases found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pressReleases.map((item: any) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedPress(item)}
                  className="flex flex-col p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#a1a1aa]">{item.date}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10 text-white/80">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-2 transition-colors group-hover:text-[#38BDF8]">{item.title}</h3>
                  <p className="text-[#a1a1aa] leading-snug mb-3 text-xs group-hover:text-[#d4d4d8] transition-colors">{item.description}</p>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#a1a1aa] group-hover:text-white transition-colors mt-auto">
                    Read Announcement <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand Assets & Guidelines */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-bold mb-1">Brand Assets & Guidelines</h2>
            <p className="text-[#a1a1aa] text-xs md:text-sm">Download official logos, colors, and typography specifications.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "Logos & Marks", format: "SVG / PNG", icon: FileText, desc: "High-resolution primary logos, dark/light variants, and icon marks." },
              { title: "Brand Guidelines", format: "PDF", icon: Award, desc: "Specifications on spacing, typography usage, and color hex values." },
              { title: "Media Kit Package", format: "ZIP", icon: Download, desc: "Complete bundle including screenshots, founder bios, and boilerplate copy." }
            ].map((asset, idx) => (
              <div key={idx} className="flex flex-col p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <asset.icon size={18} className="text-white group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="text-[10px] font-mono text-[#a1a1aa] bg-white/5 px-2 py-0.5 rounded border border-white/10">{asset.format}</span>
                </div>
                <h3 className="text-sm font-bold mb-1 group-hover:text-white transition-colors">{asset.title}</h3>
                <p className="text-[#a1a1aa] text-[11px] leading-relaxed mb-4 flex-1">{asset.desc}</p>
                <button className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-[11px] font-medium transition-colors border border-white/10">
                  Download Asset
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info / Contact Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#27272a]">
          <div className="flex flex-col p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Mail size={12} className="text-white" />
              </div>
              <h3 className="text-sm font-bold">Press Inquiries</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-[#a1a1aa] leading-relaxed mb-3">
              Are you working on an article, interview, or podcast featuring AI ecosystem trends? Reach out to our press relations team directly.
            </p>
            <a href="mailto:press@aiorbit.club" className="text-xs font-medium text-white hover:underline mt-auto">
              press@aiorbit.club →
            </a>
          </div>

          <div className="flex flex-col p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Globe size={12} className="text-white" />
              </div>
              <h3 className="text-sm font-bold">Boilerplate</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-[#a1a1aa] leading-relaxed mb-3">
              AI Orbit is a premier discovery engine mapping the global artificial intelligence landscape, empowering developers and researchers to find top-tier tools, models, and repositories.
            </p>
            <span className="text-[10px] font-mono text-[#71717a] mt-auto">
              © {new Date().getFullYear()} AI Orbit Org. All rights reserved.
            </span>
          </div>
        </div>

      </div>

      {/* Modal Popup for Full Announcement */}
      {selectedPress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-6 shadow-2xl">
            <button 
              onClick={() => setSelectedPress(null)}
              className="absolute top-4 right-4 text-[#a1a1aa] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono text-[#a1a1aa]">{selectedPress.date}</span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10 text-white/80">
                {selectedPress.tag}
              </span>
            </div>

            <h2 className="text-lg font-bold mb-3 text-white">{selectedPress.title}</h2>
            <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed mb-6">{selectedPress.description}</p>

            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedPress(null)}
                className="px-4 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-gray-200 transition-colors"
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