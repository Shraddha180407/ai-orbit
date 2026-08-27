import React from "react";
import Link from "next/link";
import { Calendar, FileText } from "lucide-react";

export default function TermsOfServicePage() {
  const sections = [
    { id: "01", title: "About AI Orbit" },
    { id: "02", title: "Using AI Orbit" },
    { id: "03", title: "AI Tool Listings" },
    { id: "04", title: "Third-Party Services" },
    { id: "05", title: "Submissions" },
    { id: "06", title: "Intellectual Property" },
    { id: "07", title: "Disclaimer" },
    { id: "08", title: "Changes To These Terms" },
    { id: "09", title: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-16 sm:pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row gap-8 lg:gap-24">

        {/* Left Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0">
          <div className="lg:sticky lg:top-24">
            <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa] mb-4 sm:mb-6">
              ON THIS PAGE
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1 sm:gap-2 mb-6 sm:mb-10 border-l border-[#27272a]">
              {sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#section-${section.id}`}
                    className={`block pl-4 py-1.5 sm:py-2 text-xs sm:text-[14px] font-medium transition-colors ${idx === 0 ? 'border-l-2 border-white text-white -ml-[1px] bg-white/5' : 'text-[#a1a1aa] hover:text-[#e4e4e7]'}`}
                  >
                    {section.id}. {section.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="p-4 sm:p-6 rounded-2xl border border-[#27272a] bg-[#0a0a0a] hidden sm:block">
              <FileText size={24} className="text-white mb-4" strokeWidth={1.5} />
              <h4 className="font-bold text-white mb-2">Please read carefully.</h4>
              <p className="text-[#a1a1aa] text-[14px] leading-relaxed">
                By using AI Orbit, you agree to these Terms of Service.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-10 mb-10 sm:mb-16 pb-10 sm:pb-16 border-b border-[#27272a]">
            <div className="max-w-[600px]">
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa] mb-4 sm:mb-6">
                TERMS OF SERVICE
              </h2>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]">
                Terms of Service
              </h1>
              <p className="text-[16px] leading-relaxed text-[#a1a1aa] mb-6">
                By accessing or using AI Orbit, you agree to these Terms of Service. Please read them carefully before using the platform.
              </p>
              <div className="flex items-center gap-2 text-[#71717a] text-[14px]">
                <Calendar size={16} />
                <span>Last updated: May 26, 2025</span>
              </div>
            </div>

            <div className="w-full lg:w-[280px] flex justify-center lg:justify-end hidden md:flex">
              <div className="relative w-full max-w-[280px] aspect-square rounded-full flex items-center justify-center">
                {/* Small Planet graphic */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1a1a1a] to-[#27272a] rounded-full opacity-40"></div>
                <div className="absolute w-[130%] h-[30%] border-t border-b border-white/20 rounded-[100%] rotate-12"></div>
                <div className="absolute w-[150%] h-[40%] border-t border-b border-white/10 rounded-[100%] rotate-12"></div>
                <div className="absolute w-[60%] h-[60%] bg-gradient-to-tr from-black via-[#111] to-[#444] rounded-full shadow-[0_0_80px_rgba(255,255,255,0.05)]"></div>
                {/* Stars */}
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-80"></div>
              </div>
            </div>
          </div>

          {/* Sections Content */}
          <div className="space-y-16 max-w-[800px]">

            <section id="section-01">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#121212] border border-[#27272a] rounded-lg px-3 py-1 text-[14px] font-bold">01</div>
                <h2 className="text-2xl font-bold">About AI Orbit</h2>
              </div>
              <div className="text-[#a1a1aa] text-[15px] leading-relaxed space-y-4">
                <p>AI Orbit is an AI discovery platform that helps users explore information about AI tools, models, companies, agents, devices, repositories, and other technologies.</p>
              </div>
            </section>

            <section id="section-02">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#121212] border border-[#27272a] rounded-lg px-3 py-1 text-[14px] font-bold">02</div>
                <h2 className="text-2xl font-bold">Using AI Orbit</h2>
              </div>
              <div className="text-[#a1a1aa] text-[15px] leading-relaxed space-y-4">
                <p>You agree to use the platform responsibly and legally.<br />You must not:</p>
                <ul className="list-disc pl-5 space-y-2 text-[#e4e4e7]">
                  <li>Use AI Orbit for unlawful activities</li>
                  <li>Attempt to disrupt or compromise the platform</li>
                  <li>Scrape or abuse the service in ways that violate applicable rules</li>
                  <li>Submit misleading, fraudulent, or harmful information</li>
                  <li>Impersonate another person or organization</li>
                  <li>Attempt to gain unauthorized access to systems or accounts</li>
                </ul>
              </div>
            </section>

            <section id="section-03">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#121212] border border-[#27272a] rounded-lg px-3 py-1 text-[14px] font-bold">03</div>
                <h2 className="text-2xl font-bold">AI Tool Listings</h2>
              </div>
              <div className="text-[#a1a1aa] text-[15px] leading-relaxed space-y-4">
                <p>AI Orbit may provide information, descriptions, links, pricing information, ratings, and other details about third-party AI products and services.</p>
                <p>AI Orbit does not guarantee that third-party information is complete, accurate, current, or error-free. Listings are provided for informational and discovery purposes only and do not constitute an endorsement.</p>
              </div>
            </section>

            {/* Placeholder sections for the rest */}
            {[
              { id: "04", title: "Third-Party Services" },
              { id: "05", title: "Submissions" },
              { id: "06", title: "Intellectual Property" },
              { id: "07", title: "Disclaimer" },
              { id: "08", title: "Changes To These Terms" },
              { id: "09", title: "Contact Us" }
            ].map(sec => (
              <section key={sec.id} id={`section-${sec.id}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#121212] border border-[#27272a] rounded-lg px-3 py-1 text-[14px] font-bold">{sec.id}</div>
                  <h2 className="text-2xl font-bold">{sec.title}</h2>
                </div>
                <div className="text-[#a1a1aa] text-[15px] leading-relaxed space-y-4">
                  <p>This is a placeholder for the {sec.title.toLowerCase()} section. In a full implementation, detailed terms of service text would go here.</p>
                </div>
              </section>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
