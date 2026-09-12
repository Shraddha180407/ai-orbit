import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Diamond,
  Users,
  Globe2,
  Mail,
  Clock,
  Star
} from "lucide-react";

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-4 sm:pt-6 pb-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div className="w-full lg:w-3/5">
            <div className="mb-2 sm:mb-3 flex items-center gap-4">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                ADVERTISE
              </h2>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3 leading-[1.1]">
              Advertise with<br />AI Orbit
            </h1>

            <h3 className="text-sm sm:text-base font-bold text-white mb-2">
              Reach the world's most engaged AI audience.
            </h3>

            <p className="text-xs sm:text-sm leading-relaxed text-[#a1a1aa] mb-3 sm:mb-4 max-w-[700px]">
              Put your brand in front of builders, researchers, founders, and professionals who are actively exploring the AI ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="#options"
                className="inline-flex items-center justify-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors group text-[11px] sm:text-xs"
              >
                Explore Ad Options
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:theaisignal.india@gmail.com"
                className="inline-flex items-center justify-center gap-1.5 bg-transparent border border-[#3f3f46] text-white px-3 py-1.5 rounded-full font-medium hover:bg-white/5 transition-colors group text-[11px] sm:text-xs"
              >
                Contact Sales
                <ArrowRight size={14} className="text-[#a1a1aa] group-hover:text-white transition-colors group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex justify-end hidden md:flex">
            <div className="relative w-full max-w-[380px] aspect-square rounded-full flex items-center justify-center">
              {/* Planet SVG Representation */}
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

        {/* Why Advertise Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-1">Why Advertise on AI Orbit?</h2>
            <p className="text-[#a1a1aa] text-xs md:text-sm max-w-[600px] mx-auto">
              We connect your brand with a global community actively discovering, comparing, and choosing AI solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {[
              { title: "High-Intent Traffic", icon: Target, desc: "Reach people who are actively discovering and choosing AI tools and technologies." },
              { title: "Premium Visibility", icon: Diamond, desc: "Get featured in high-traffic zones across our platform with maximum visibility." },
              { title: "Relevant Audience", icon: Users, desc: "Connect with builders, founders, researchers, and AI enthusiasts." },
              { title: "Global Reach", icon: Globe2, desc: "Showcase your brand to a global audience passionate about AI and innovation." },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col p-3 sm:p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
                <item.icon size={16} className="mb-2 text-white" strokeWidth={1.5} />
                <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-snug text-[11px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Placement Options Section */}
        <div id="options" className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-1">Ad Placement Options</h2>
            <p className="text-[#a1a1aa] text-xs md:text-sm">Choose the placement that fits your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">

            {/* Homepage Spotlight */}
            <div className="flex flex-col p-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-xs font-bold text-center mb-3">Homepage Spotlight</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-lg border border-[#27272a] mb-3 p-2 flex flex-col gap-1">
                <div className="flex gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                </div>
                {/* Highlighted Banner */}
                <div className="w-full h-10 bg-[#5b21b6] rounded flex-shrink-0"></div>
                <div className="flex gap-2 h-8">
                  <div className="flex-1 bg-[#27272a] rounded opacity-50"></div>
                  <div className="flex-1 bg-[#27272a] rounded opacity-50"></div>
                  <div className="flex-1 bg-[#27272a] rounded opacity-50"></div>
                </div>
              </div>
              <p className="text-[#a1a1aa] text-[10px] text-center leading-snug">
                Large, prominent placement on the AI Orbit homepage.
              </p>
            </div>

            {/* Category Banner */}
            <div className="flex flex-col p-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-xs font-bold text-center mb-3">Category Banner</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-lg border border-[#27272a] mb-3 p-2 flex flex-col gap-1">
                <div className="flex gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                </div>
                <div className="flex gap-2 flex-1">
                  <div className="w-6 h-full flex flex-col gap-1.5">
                    <div className="w-full h-1.5 bg-[#27272a] rounded opacity-50"></div>
                    <div className="w-full h-1.5 bg-[#27272a] rounded opacity-50"></div>
                    <div className="w-full h-1.5 bg-[#27272a] rounded opacity-50"></div>
                  </div>
                  <div className="flex-1 h-full flex flex-col gap-2">
                    {/* Highlighted Banner */}
                    <div className="w-full h-4 bg-[#5b21b6] rounded flex-shrink-0"></div>
                    <div className="w-full h-full bg-[#27272a] rounded opacity-30"></div>
                  </div>
                </div>
              </div>
              <p className="text-[#a1a1aa] text-[10px] text-center leading-snug">
                Display your banner on category pages.
              </p>
            </div>

            {/* Sidebar Banner */}
            <div className="flex flex-col p-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-xs font-bold text-center mb-3">Sidebar Banner</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-lg border border-[#27272a] mb-3 p-2 flex flex-col gap-1">
                <div className="flex gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                </div>
                <div className="flex gap-2 flex-1">
                  <div className="flex-1 h-full flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#27272a] rounded opacity-50"></div>
                      <div className="w-12 h-2 bg-[#27272a] rounded opacity-50"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#27272a] rounded opacity-50"></div>
                      <div className="w-10 h-2 bg-[#27272a] rounded opacity-50"></div>
                    </div>
                  </div>
                  {/* Highlighted Banner */}
                  <div className="w-8 h-full bg-[#5b21b6] rounded flex-shrink-0"></div>
                </div>
              </div>
              <p className="text-[#a1a1aa] text-[10px] text-center leading-snug">
                High-visibility placement on the sidebar across key pages.
              </p>
            </div>

            {/* Featured Listing */}
            <div className="flex flex-col p-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-xs font-bold text-center mb-3">Featured Listing</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-lg border border-[#27272a] mb-3 p-2 flex flex-col gap-1">
                <div className="flex gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></div>
                </div>

                <div className="flex items-center justify-between p-1 border-b border-[#27272a]">
                  <div className="w-8 h-2 bg-[#27272a] rounded opacity-50"></div>
                </div>
                {/* Highlighted Listing */}
                <div className="flex items-center justify-between p-1.5 bg-white/5 rounded border border-[#5b21b6]">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#5b21b6] rounded-full flex items-center justify-center"><Star size={8} className="text-white fill-white" /></div>
                    <div className="flex flex-col gap-1">
                      <div className="w-10 h-1.5 bg-[#a1a1aa] rounded"></div>
                      <div className="w-14 h-1 bg-[#71717a] rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-1 border-b border-[#27272a]">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#27272a] rounded opacity-50"></div>
                    <div className="w-10 h-1.5 bg-[#27272a] rounded opacity-50"></div>
                  </div>
                </div>
              </div>
              <p className="text-[#a1a1aa] text-[10px] text-center leading-snug">
                Highlight your AI tool or company with a featured listing badge.
              </p>
            </div>

            {/* Newsletter Feature */}
            <div className="flex flex-col p-3 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-xs font-bold text-center mb-3">Newsletter Feature</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-lg border border-[#27272a] mb-3 p-2 flex flex-col gap-1">
                <div className="flex justify-center mb-1">
                  <div className="w-12 h-2 bg-[#3f3f46] rounded"></div>
                </div>
                <div className="w-full h-1 bg-[#27272a] mb-1"></div>
                <div className="w-3/4 h-1.5 bg-[#3f3f46] rounded mb-0.5"></div>
                <div className="w-full h-1.5 bg-[#27272a] rounded mb-0.5"></div>
                <div className="w-5/6 h-1.5 bg-[#27272a] rounded mb-2"></div>

                {/* Highlighted Banner */}
                <div className="w-full flex-1 bg-[#5b21b6] rounded flex-shrink-0 mt-auto"></div>
              </div>
              <p className="text-[#a1a1aa] text-[10px] text-center leading-snug">
                Feature your brand in our weekly AI newsletter.
              </p>
            </div>

          </div>

          <div className="flex justify-center mt-6">
            <a href="mailto:theaisignal.india@gmail.com" className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-[#a1a1aa] transition-colors group">
              View all options <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Let's Talk CTA */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 bg-[#0a0a0a] border border-[#27272a] rounded-xl gap-6">

          <div className="flex items-center gap-6 lg:w-1/2">
            {/* Wireframe planet logo */}
            <div className="w-16 h-16 shrink-0 rounded-full border border-white flex items-center justify-center relative overflow-hidden hidden sm:flex">
              <div className="absolute w-[140%] h-[40%] border border-white rounded-[100%] rotate-45"></div>
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-2 left-3"></div>
              <div className="absolute w-1 h-1 bg-white rounded-full bottom-3 right-4"></div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold mb-1">Let's Talk</h2>
              <p className="text-[#a1a1aa] leading-snug text-[11px] sm:text-xs">
                Have a custom request or need help choosing the right option?<br />
                Our team is here to help you get the best results.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 lg:w-1/2 justify-end w-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Mail size={12} className="text-[#a1a1aa]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] text-[#a1a1aa]">Email Us</span>
                  <span className="text-[11px] sm:text-xs font-medium text-white">theaisignal.india@gmail.com</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Clock size={12} className="text-[#a1a1aa]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-[11px] text-[#a1a1aa]">We typically reply within</span>
                  <span className="text-[11px] sm:text-xs font-medium text-white">24–48 hours</span>
                </div>
              </div>
            </div>

            <a
              href="mailto:theaisignal.india@gmail.com"
              className="inline-flex items-center justify-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors group shrink-0 ml-auto sm:ml-4 text-xs"
            >
              Contact Sales
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
