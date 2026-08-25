"use client";

import React, { useState } from "react";
import Link from "next/link";
import Compass from 'lucide-react/dist/esm/icons/compass';
import Star from 'lucide-react/dist/esm/icons/star';
import Users from 'lucide-react/dist/esm/icons/users';
import Mail from 'lucide-react/dist/esm/icons/mail';

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const PlanetGraphics = () => (
  <svg className="absolute -left-[200px] bottom-0 w-[600px] h-[600px] pointer-events-none z-0" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="450" r="160" fill="url(#planet-grad)" />
    
    <g transform="rotate(-25 300 450)">
      <ellipse cx="300" cy="450" rx="340" ry="100" stroke="url(#ring-grad-1)" strokeWidth="1.5" />
      <circle cx="-40" cy="450" r="5" fill="#9333EA" />
    </g>
    
    <g transform="rotate(-10 300 450)">
      <ellipse cx="300" cy="450" rx="420" ry="140" stroke="url(#ring-grad-2)" strokeWidth="1.5" />
      <circle cx="720" cy="450" r="4" fill="#9333EA" />
    </g>
    
    <defs>
      <radialGradient id="planet-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(150 450) rotate(90) scale(160)">
        <stop stopColor="#3B0764" />
        <stop offset="0.8" stopColor="#000000" />
      </radialGradient>
      <linearGradient id="ring-grad-1" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9333EA" stopOpacity="0.5" />
        <stop offset="1" stopColor="#9333EA" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ring-grad-2" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9333EA" stopOpacity="0.3" />
        <stop offset="1" stopColor="#9333EA" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const LINK_GROUPS = [
  {
    heading: "EXPLORE",
    icon: Compass,
    links: [
      { label: "Tools", href: "/tools" },
      { label: "Agents", href: "/agents" },
      { label: "Tasks", href: "/tasks" },
      { label: "Companies", href: "/companies" },
      { label: "News", href: "/news" },
      { label: "Videos", href: "/videos" },
      { label: "Robots", href: "/robots" },
      { label: "Devices", href: "/devices" },
      { label: "Models", href: "/models" },
      { label: "Repositories", href: "/repositories" },
      { label: "MCP", href: "/mcp" },
      { label: "Collections", href: "/collections" },
      { label: "Personal", href: "/personal" },
    ]
  },
  {
    heading: "DISCOVER",
    icon: Star,
    links: [
      { label: "Top Rated", href: "/tools?sort=rating" },
      { label: "Search AI", href: "/search" },
      { label: "Compare AI Tools", href: "/tools/compare" },
    ]
  },
  {
    heading: "CONTRIBUTE",
    icon: Users,
    links: [
      { label: "Submit a Tool", href: "#" },
      { label: "Update a Listing", href: "#" },
      { label: "Add a Company", href: "#" },
      { label: "Suggest a Resource", href: "#" },
    ]
  },
  {
    heading: "AI ORBIT",
    icon: Compass,
    links: [
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Resources", href: "#" },
      { label: "Newsletter", href: "#" },
      { label: "About AI Orbit", href: "#" },
      { label: "Contact", href: "#" },
    ]
  }
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail("");
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="w-full bg-black p-4 sm:p-6 lg:p-8">
      <footer className="relative mx-auto max-w-[1600px] border border-[#232326] rounded-[24px] bg-black overflow-hidden px-8 py-16 lg:px-16 lg:py-20">
        
        {/* Background Planet Graphics */}
        <PlanetGraphics />

        {/* Main Content Container */}
        <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column - Brand & Socials */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col">
            <Link href="/" className="flex items-center gap-3 mb-6 w-fit">
              <Compass size={40} className="text-white" strokeWidth={1.5} />
              <span className="text-3xl font-bold text-white tracking-tight">AI Orbit</span>
            </Link>
            
            <h2 className="text-[17px] text-white font-medium mb-4">
              The Home of Everything AI.
            </h2>
            
            <p className="text-[14px] leading-relaxed text-[#A1A1AA] mb-10 max-w-[280px]">
              Discover, compare, and explore the tools, models, companies, and technologies shaping the AI ecosystem.
            </p>
            
            <div className="flex items-center gap-4">
              {[
                { Icon: XIcon, href: "https://twitter.com", label: "X" },
                { Icon: LinkedInIcon, href: "https://linkedin.com", label: "LinkedIn" },
                { Icon: DiscordIcon, href: "https://discord.com", label: "Discord" },
                { Icon: YouTubeIcon, href: "https://youtube.com", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a 
                  key={label} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#232326] text-[#A1A1AA] hover:text-white hover:bg-[#111113] hover:border-[#3a3a3d] transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Newsletter & Links */}
          <div className="flex-1 flex flex-col">
            
            {/* Newsletter Card */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-8 rounded-2xl border border-[#232326] bg-black mb-16 gap-6">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#232326]">
                  <Mail className="text-white" size={20} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="text-[17px] font-semibold text-white mb-1.5">Stay in Orbit</h3>
                  <p className="text-[14px] text-[#A1A1AA] leading-relaxed max-w-[400px]">
                    Don't miss what's happening in AI.<br className="hidden sm:block" />
                    Get the latest tools, launches, trends,<br className="hidden sm:block" />
                    and AI signals delivered to your inbox.
                  </p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto xl:ml-auto">
                <form onSubmit={handleSubscribe} className="flex w-full sm:w-auto h-12">
                  <input 
                    type="email" 
                    required
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-full w-full sm:w-[260px] bg-transparent border border-[#232326] border-r-0 rounded-l-lg px-4 text-[14px] text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#4a4a4d] transition-colors"
                  />
                  <button 
                    type="submit" 
                    className="h-full px-6 bg-white text-black text-[14px] font-semibold rounded-r-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                {subscribed && (
                  <p className="text-[#A1A1AA] text-[13px] mt-2 animate-pulse">Thanks for subscribing!</p>
                )}
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12">
              {LINK_GROUPS.map((group, idx) => (
                <div 
                  key={group.heading} 
                  className={`flex flex-col ${
                    idx !== 0 ? 'md:border-l md:border-[#232326] md:pl-10 lg:pl-12' : 'md:pr-10 lg:pr-12'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <group.icon size={16} className="text-white" strokeWidth={2} />
                    <h4 className="text-[13px] font-bold text-white uppercase tracking-widest">
                      {group.heading}
                    </h4>
                  </div>
                  
                  <ul className="space-y-3.5">
                    {group.links.map((link) => (
                      <li key={link.label} className="flex items-center gap-3">
                        <span className="w-1 h-1 rounded-full bg-[#A1A1AA]"></span>
                        <Link 
                          href={link.href} 
                          className="text-[14px] text-[#A1A1AA] hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Row */}
        <div className="relative z-10 mt-20 pt-8 border-t border-[#232326] flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-[#A1A1AA]">
          <div>
            &copy; {new Date().getFullYear()} AI Orbit. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/p/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-[#4a4a4d]">&bull;</span>
            <Link href="/p/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span className="text-[#4a4a4d]">&bull;</span>
            <Link href="/p/cookie" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <Compass size={16} strokeWidth={2} />
            <span className="font-medium">The Home of Everything AI.</span>
          </div>
        </div>

      </footer>
    </div>
  );
}