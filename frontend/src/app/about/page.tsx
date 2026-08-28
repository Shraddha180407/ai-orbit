import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Package,
  Bot,
  Layers,
  Building2,
  Smartphone,
  Cpu,
  Code,
  Network,
  Target,
  Star,
  Users
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex-1 bg-black text-white font-sans selection:bg-white/30 pt-4 sm:pt-6 pb-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div className="w-full lg:w-3/5">
            <div className="mb-2 sm:mb-3 flex items-center gap-4">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                ABOUT AI ORBIT
              </h2>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3 leading-[1.1]">
              Everything AI.<br />In One Orbit.
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed text-[#e4e4e7] mb-2 sm:mb-3 max-w-[700px]">
              AI Orbit is a discovery platform built to help you explore the rapidly evolving world of artificial intelligence — from tools and models to companies, agents, devices, robots, repositories, MCP servers, and more.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-[#a1a1aa] mb-3 sm:mb-4 max-w-[700px]">
              We bring the entire AI ecosystem together in one place so you can discover what matters, faster.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors group text-[11px] sm:text-xs"
            >
              Explore AI Orbit
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full lg:w-2/5 flex justify-end hidden md:flex">
            <div className="relative w-full max-w-[380px] aspect-square rounded-full flex items-center justify-center">
              {/* Planet SVG Representation since image could not be copied */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1a1a1a] to-[#27272a] rounded-full opacity-60"></div>
              <div className="absolute w-[140%] h-[40%] border border-white/20 rounded-[100%] rotate-12"></div>
              <div className="absolute w-[150%] h-[45%] border border-white/10 rounded-[100%] rotate-12"></div>
              <div className="absolute w-[160%] h-[50%] border border-white/5 rounded-[100%] rotate-12"></div>
              <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-black via-[#111] to-[#333] rounded-full shadow-[0_0_100px_rgba(255,255,255,0.1)]"></div>
              {/* Stars/Dots */}
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full opacity-80"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-3 border-t border-b border-[#27272a] mb-8 bg-[#0a0a0a] rounded-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">10K+</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">AI Tools</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">2K+</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">AI Companies</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">5K+</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">Models & Agents</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-lg md:text-xl font-bold mb-0.5">50K+</div>
            <div className="text-[11px] sm:text-xs text-[#a1a1aa] font-medium">Monthly Explorers</div>
          </div>
        </div>

        {/* What You Can Discover Section */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-xl font-bold mb-1">What You Can Discover</h2>
            <p className="text-[#a1a1aa] text-xs md:text-sm">Explore every corner of the AI ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {[
              { title: "AI Tools", icon: Package, href: "/tools", colorClass: "group-hover:text-[#FFC53D] group-hover:drop-shadow-[0_0_8px_rgba(255,197,61,0.8)]", desc: "Discover tools built for writing, design, productivity, coding, research, marketing and more." },
              { title: "AI Agents", icon: Bot, href: "/agents", colorClass: "group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]", desc: "Explore AI agents designed to perform tasks, automate workflows, and work alongside people." },
              { title: "AI Models", icon: Layers, href: "/models", colorClass: "group-hover:text-[#A78BFA] group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]", desc: "Explore the models powering the next generation of AI applications." },
              { title: "AI Companies", icon: Building2, href: "/companies", colorClass: "group-hover:text-[#38BDF8] group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]", desc: "Discover the companies building and shaping the AI ecosystem." },
              { title: "AI Devices", icon: Smartphone, href: "/devices", colorClass: "group-hover:text-[#F472B6] group-hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]", desc: "Explore hardware bringing AI into the physical world." },
              { title: "AI Robots", icon: Cpu, href: "/robots", colorClass: "group-hover:text-[#2DD4BF] group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]", desc: "Discover robotics and intelligent machines powered by AI." },
              { title: "Repositories", icon: Code, href: "/repositories", colorClass: "group-hover:text-[#22D3EE] group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]", desc: "Explore open-source projects and resources shaping AI development." },
              { title: "MCP", icon: Network, href: "/mcp", colorClass: "group-hover:text-[#818CF8] group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]", desc: "Discover tools and resources around the Model Context Protocol ecosystem." },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="flex flex-col p-3 sm:p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all duration-300 group">
                <item.icon size={16} className={`mb-2 text-white transition-all duration-300 ${item.colorClass}`} strokeWidth={1.5} />
                <h3 className="text-sm font-bold mb-1 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-snug mb-2 flex-1 text-[11px] group-hover:text-[#d4d4d8] transition-colors">{item.desc}</p>
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#a1a1aa] group-hover:text-white group-hover:gap-1.5 transition-all mt-auto">
                  Explore {item.title.replace('AI ', '')} <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#27272a]">

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Target size={12} className="text-white" />
              </div>
              <h3 className="text-sm font-bold">Our Mission</h3>
            </div>
            <p className="text-xs font-medium text-white mb-1">
              Make AI easier to discover.
            </p>
            <p className="text-[11px] sm:text-xs text-[#a1a1aa] leading-relaxed">
              AI Orbit exists to make the growing AI ecosystem easier to navigate, understand, and explore.
            </p>
          </div>

          <div className="flex flex-col md:border-l md:border-r border-[#27272a] md:px-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Star size={12} className="text-white" />
              </div>
              <h3 className="text-sm font-bold">Why AI Orbit?</h3>
            </div>
            <ul className="space-y-1">
              {[
                "Curated & up-to-date",
                "Easy to explore & discover",
                "Trusted by builders, researchers and AI enthusiasts",
                "Built for the community"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-[#e4e4e7]">
                  <span className="text-white mt-0.5">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:pl-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Users size={12} className="text-white" />
              </div>
              <h3 className="text-sm font-bold">Who It's For?</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-[#e4e4e7] mb-1 leading-relaxed">
              AI Orbit is for anyone who wants to stay ahead in AI.
            </p>
            <p className="text-[11px] sm:text-xs text-[#a1a1aa] leading-relaxed">
              From developers and researchers to founders and enthusiasts.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
