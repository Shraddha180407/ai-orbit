import React from "react";
import Link from "next/link";
import { Calendar, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "01", title: "Information We Collect" },
    { id: "02", title: "How We Use Information" },
    { id: "03", title: "AI Tool Listings" },
    { id: "04", title: "Cookies & Analytics" },
    { id: "05", title: "Third-Party Services" },
    { id: "06", title: "Data Security" },
    { id: "07", title: "Your Rights" },
    { id: "08", title: "Changes To This Policy" },
    { id: "09", title: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-24 pb-12 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-24">
            <h3 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa] mb-6">
              ON THIS PAGE
            </h3>
            <ul className="space-y-2 mb-10 border-l border-[#27272a]">
              {sections.map((section, idx) => (
                <li key={section.id}>
                  <a 
                    href={`#section-${section.id}`}
                    className={`block pl-4 py-2 text-[14px] font-medium transition-colors ${idx === 0 ? 'border-l-2 border-white text-white -ml-[1px] bg-white/5' : 'text-[#a1a1aa] hover:text-[#e4e4e7]'}`}
                  >
                    {section.id}. {section.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="p-6 rounded-2xl border border-[#27272a] bg-[#0a0a0a]">
              <ShieldCheck size={24} className="text-white mb-4" strokeWidth={1.5} />
              <h4 className="font-bold text-white mb-2">Your privacy matters.</h4>
              <p className="text-[#a1a1aa] text-[14px] leading-relaxed">
                We are committed to protecting your data and being transparent about how we use it.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16 pb-16 border-b border-[#27272a]">
            <div className="max-w-[600px]">
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa] mb-6">
                PRIVACY POLICY
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                Privacy Policy
              </h1>
              <p className="text-[16px] leading-relaxed text-[#a1a1aa] mb-6">
                Your privacy matters. This Privacy Policy explains how AI Orbit collects, uses, and protects information when you use our platform.
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
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              <div className="text-[#a1a1aa] text-[15px] leading-relaxed space-y-4">
                <p>Depending on the features you use, AI Orbit may collect information such as:</p>
                <ul className="list-disc pl-5 space-y-2 text-[#e4e4e7]">
                  <li>Information you provide when creating an account</li>
                  <li>Email address when subscribing to communications</li>
                  <li>Information submitted through tool submissions or forms</li>
                  <li>Technical information such as browser type, device information, and IP address</li>
                  <li>Usage information about how you interact with the platform</li>
                </ul>
              </div>
            </section>

            <section id="section-02">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#121212] border border-[#27272a] rounded-lg px-3 py-1 text-[14px] font-bold">02</div>
                <h2 className="text-2xl font-bold">How We Use Information</h2>
              </div>
              <div className="text-[#a1a1aa] text-[15px] leading-relaxed space-y-4">
                <p>We may use collected information to:</p>
                <ul className="list-disc pl-5 space-y-2 text-[#e4e4e7]">
                  <li>Provide and maintain AI Orbit</li>
                  <li>Improve the platform and user experience</li>
                  <li>Process submissions</li>
                  <li>Respond to enquiries</li>
                  <li>Send newsletters or updates when you have subscribed</li>
                  <li>Detect abuse and maintain platform security</li>
                  <li>Understand how the platform is used</li>
                </ul>
              </div>
            </section>
            
            {/* Placeholder sections for the rest to keep the layout complete */}
            {[
              { id: "03", title: "AI Tool Listings" },
              { id: "04", title: "Cookies & Analytics" },
              { id: "05", title: "Third-Party Services" },
              { id: "06", title: "Data Security" },
              { id: "07", title: "Your Rights" },
              { id: "08", title: "Changes To This Policy" },
              { id: "09", title: "Contact Us" }
            ].map(sec => (
              <section key={sec.id} id={`section-${sec.id}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#121212] border border-[#27272a] rounded-lg px-3 py-1 text-[14px] font-bold">{sec.id}</div>
                  <h2 className="text-2xl font-bold">{sec.title}</h2>
                </div>
                <div className="text-[#a1a1aa] text-[15px] leading-relaxed space-y-4">
                  <p>This is a placeholder for the {sec.title.toLowerCase()} section. In a full implementation, detailed policy text would go here explaining our practices regarding {sec.title.toLowerCase()}.</p>
                </div>
              </section>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
