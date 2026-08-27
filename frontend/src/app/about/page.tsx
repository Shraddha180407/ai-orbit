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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-24 pb-12 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32">
          <div className="w-full lg:w-1/2">
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                ABOUT AI ORBIT
              </h2>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Everything AI.<br />In One Orbit.
            </h1>
            
            <p className="text-[18px] leading-relaxed text-[#e4e4e7] mb-6 max-w-[540px]">
              AI Orbit is a discovery platform built to help you explore the rapidly evolving world of artificial intelligence — from tools and models to companies, agents, devices, robots, repositories, MCP servers, and more.
            </p>
            
            <p className="text-[18px] leading-relaxed text-[#a1a1aa] mb-10 max-w-[540px]">
              We bring the entire AI ecosystem together in one place so you can discover what matters, faster.
            </p>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors group"
            >
              Explore AI Orbit 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square rounded-full flex items-center justify-center">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-[#27272a] mb-32 bg-[#0a0a0a] rounded-2xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
            <div className="text-[#a1a1aa] font-medium">AI Tools</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">2K+</div>
            <div className="text-[#a1a1aa] font-medium">AI Companies</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">5K+</div>
            <div className="text-[#a1a1aa] font-medium">Models & Agents</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
            <div className="text-[#a1a1aa] font-medium">Monthly Explorers</div>
          </div>
        </div>

        {/* What You Can Discover Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Can Discover</h2>
            <p className="text-[#a1a1aa] text-lg">Explore every corner of the AI ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "AI Tools", icon: Package, href: "/tools", desc: "Discover tools built for writing, design, productivity, coding, research, marketing and more." },
              { title: "AI Agents", icon: Bot, href: "/agents", desc: "Explore AI agents designed to perform tasks, automate workflows, and work alongside people." },
              { title: "AI Models", icon: Layers, href: "/models", desc: "Explore the models powering the next generation of AI applications." },
              { title: "AI Companies", icon: Building2, href: "/companies", desc: "Discover the companies building and shaping the AI ecosystem." },
              { title: "AI Devices", icon: Smartphone, href: "/devices", desc: "Explore hardware bringing AI into the physical world." },
              { title: "AI Robots", icon: Cpu, href: "/robots", desc: "Discover robotics and intelligent machines powered by AI." },
              { title: "Repositories", icon: Code, href: "/repositories", desc: "Explore open-source projects and resources shaping AI development." },
              { title: "MCP", icon: Network, href: "/mcp", desc: "Discover tools and resources around the Model Context Protocol ecosystem." },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} className="flex flex-col p-8 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all group">
                <item.icon size={32} className="mb-6 text-white" strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed mb-8 flex-1 text-sm">{item.desc}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all mt-auto">
                  Explore {item.title.replace('AI ', '')} <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-[#27272a]">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Target size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
            </div>
            <p className="font-medium text-white mb-4">
              Make AI easier to discover.
            </p>
            <p className="text-[#a1a1aa] leading-relaxed">
              AI Orbit exists to make the growing AI ecosystem easier to navigate, understand, and explore.
            </p>
          </div>

          <div className="flex flex-col md:border-l md:border-r border-[#27272a] md:px-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Star size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Why AI Orbit?</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Curated & up-to-date",
                "Easy to explore & discover",
                "Trusted by builders, researchers and AI enthusiasts",
                "Built for the community"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[#e4e4e7]">
                  <span className="text-white mt-1">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:pl-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full border border-[#3f3f46] flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold">Who It's For?</h3>
            </div>
            <p className="text-[#e4e4e7] mb-6 leading-relaxed">
              AI Orbit is for anyone who wants to stay ahead in AI.
            </p>
            <p className="text-[#a1a1aa] leading-relaxed">
              From developers and researchers to founders and enthusiasts.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
