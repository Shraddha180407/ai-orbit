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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-16 sm:pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-16 mb-16 sm:mb-32">
          <div className="w-full lg:w-1/2">
            <div className="mb-4 sm:mb-6 flex items-center gap-4">
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                ADVERTISE
              </h2>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-[1.1]">
              Advertise with<br />AI Orbit
            </h1>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Reach the world's most engaged AI audience.
            </h3>
            
            <p className="text-base sm:text-[18px] leading-relaxed text-[#a1a1aa] mb-8 sm:mb-10 max-w-[500px]">
              Put your brand in front of builders, researchers, founders, and professionals who are actively exploring the AI ecosystem.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link 
                href="#options"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 sm:px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors group text-sm sm:text-base"
              >
                Explore Ad Options 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="mailto:theaisignal.india@gmail.com"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#3f3f46] text-white px-5 sm:px-6 py-3 rounded-full font-medium hover:bg-white/5 transition-colors group text-sm sm:text-base"
              >
                Contact Sales 
                <ArrowRight size={18} className="text-[#a1a1aa] group-hover:text-white transition-colors group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end hidden md:flex">
            <div className="relative w-full max-w-[500px] aspect-square rounded-full flex items-center justify-center">
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
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Advertise on AI Orbit?</h2>
            <p className="text-[#a1a1aa] text-lg max-w-[600px] mx-auto">
              We connect your brand with a global community actively discovering, comparing, and choosing AI solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "High-Intent Traffic", icon: Target, desc: "Reach people who are actively discovering and choosing AI tools and technologies." },
              { title: "Premium Visibility", icon: Diamond, desc: "Get featured in high-traffic zones across our platform with maximum visibility." },
              { title: "Relevant Audience", icon: Users, desc: "Connect with builders, founders, researchers, and AI enthusiasts." },
              { title: "Global Reach", icon: Globe2, desc: "Showcase your brand to a global audience passionate about AI and innovation." },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col p-8 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
                <item.icon size={32} className="mb-6 text-white" strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed text-[15px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Placement Options Section */}
        <div id="options" className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ad Placement Options</h2>
            <p className="text-[#a1a1aa] text-lg">Choose the placement that fits your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {/* Homepage Spotlight */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-[15px] font-bold text-center mb-6">Homepage Spotlight</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-xl border border-[#27272a] mb-6 p-3 flex flex-col gap-2">
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
              <p className="text-[#a1a1aa] text-[13px] text-center leading-relaxed">
                Large, prominent placement on the AI Orbit homepage.
              </p>
            </div>

            {/* Category Banner */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-[15px] font-bold text-center mb-6">Category Banner</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-xl border border-[#27272a] mb-6 p-3 flex flex-col gap-2">
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
              <p className="text-[#a1a1aa] text-[13px] text-center leading-relaxed">
                Display your banner on category pages.
              </p>
            </div>

            {/* Sidebar Banner */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-[15px] font-bold text-center mb-6">Sidebar Banner</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-xl border border-[#27272a] mb-6 p-3 flex flex-col gap-2">
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
              <p className="text-[#a1a1aa] text-[13px] text-center leading-relaxed">
                High-visibility placement on the sidebar across key pages.
              </p>
            </div>

            {/* Featured Listing */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-[15px] font-bold text-center mb-6">Featured Listing</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-xl border border-[#27272a] mb-6 p-3 flex flex-col gap-2">
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
              <p className="text-[#a1a1aa] text-[13px] text-center leading-relaxed">
                Highlight your AI tool or company with a featured listing badge.
              </p>
            </div>

            {/* Newsletter Feature */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors">
              <h3 className="text-[15px] font-bold text-center mb-6">Newsletter Feature</h3>
              <div className="w-full aspect-[4/3] bg-[#121212] rounded-xl border border-[#27272a] mb-6 p-3 flex flex-col gap-2">
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
              <p className="text-[#a1a1aa] text-[13px] text-center leading-relaxed">
                Feature your brand in our weekly AI newsletter.
              </p>
            </div>

          </div>
          
          <div className="flex justify-center mt-12">
            <a href="mailto:theaisignal.india@gmail.com" className="flex items-center gap-2 text-[15px] font-medium text-white hover:text-[#a1a1aa] transition-colors group">
              View all options <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Let's Talk CTA */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-8 lg:p-12 bg-[#0a0a0a] border border-[#27272a] rounded-[32px] gap-10">
          
          <div className="flex items-center gap-8 lg:w-1/2">
            {/* Wireframe planet logo */}
            <div className="w-24 h-24 shrink-0 rounded-full border-2 border-white flex items-center justify-center relative overflow-hidden hidden sm:flex">
               <div className="absolute w-[140%] h-[40%] border-2 border-white rounded-[100%] rotate-45"></div>
               <div className="absolute w-2 h-2 bg-white rounded-full top-3 left-4"></div>
               <div className="absolute w-1 h-1 bg-white rounded-full bottom-4 right-6"></div>
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-2">Let's Talk</h2>
              <p className="text-[#a1a1aa] leading-relaxed text-[15px]">
                Have a custom request or need help choosing the right option?<br />
                Our team is here to help you get the best results.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 lg:w-1/2 justify-end w-full">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Mail size={16} className="text-[#a1a1aa]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#a1a1aa]">Email Us</span>
                  <span className="text-[15px] font-medium text-white">theaisignal.india@gmail.com</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Clock size={16} className="text-[#a1a1aa]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-[#a1a1aa]">We typically reply within</span>
                  <span className="text-[15px] font-medium text-white">24–48 hours</span>
                </div>
              </div>
            </div>
            
            <a 
              href="mailto:theaisignal.india@gmail.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors group shrink-0 ml-auto sm:ml-4"
            >
              Contact Sales 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
