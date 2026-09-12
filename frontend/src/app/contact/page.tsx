import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MessageSquare,
  Send,
  Handshake,
  Bug,
  Users,
  Clock,
  ShieldCheck,
  Lock,
  Plus
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-4 sm:pt-6 pb-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-8 sm:mb-12">
          <div className="w-full lg:w-3/5">
            <div className="mb-2 sm:mb-3 flex items-center gap-4">
              <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                CONTACT
              </h2>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 sm:mb-3 leading-[1.1]">
              Let's Connect.
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed text-[#e4e4e7] mb-2 max-w-[700px]">
              Have a question, found an issue, want to suggest an AI tool, or interested in working with AI Orbit?
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#a1a1aa] mb-3 sm:mb-4 max-w-[700px]">
              We'd love to hear from you.
            </p>

            <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#0a0a0a] border border-[#27272a] rounded-xl p-2 sm:p-3 px-3 sm:px-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#3f3f46] flex items-center justify-center bg-[#121212] shrink-0">
                <Mail size={14} className="text-[#a1a1aa]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-[11px] text-[#a1a1aa] font-medium">We usually reply within</span>
                <span className="text-xs sm:text-[13px] font-bold text-white">24–48 hours</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex justify-end hidden md:flex">
            <div className="relative w-full max-w-[380px] aspect-square rounded-full flex items-center justify-center">
              {/* Planet graphic */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#1a1a1a] to-[#27272a] rounded-full opacity-40"></div>
              <div className="absolute w-[130%] h-[30%] border-t border-b border-white/20 rounded-[100%] rotate-12"></div>
              <div className="absolute w-[150%] h-[40%] border-t border-b border-white/10 rounded-[100%] rotate-12"></div>
              <div className="absolute w-[60%] h-[60%] bg-gradient-to-tr from-black via-[#111] to-[#444] rounded-full shadow-[0_0_80px_rgba(255,255,255,0.05)]"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full shadow-[inset_-20px_-20px_60px_rgba(0,0,0,0.8)]"></div>

              {/* Stars */}
              <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-60"></div>
              <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full opacity-80"></div>
              <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full opacity-40"></div>
            </div>
          </div>
        </div>

        {/* Contact Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-8">
          {[
            { title: "General Enquiries", icon: MessageSquare, action: "theaisignal.india@gmail.com", isLink: false, desc: "Questions, feedback or anything else." },
            { title: "Submit an AI Tool", icon: Send, action: "Submit a Tool", isLink: true, href: "/submit", desc: "Have an AI tool that belongs on AI Orbit?" },
            { title: "Business & Partnerships", icon: Handshake, action: "theaisignal.india@gmail.com", isLink: false, desc: "Partnerships, collaborations and advertising." },
            { title: "Report an Issue", icon: Bug, action: "Report an Issue", isLink: true, href: "/report", desc: "Found a bug or something not working as expected?" },
          ].map((item, idx) => (
            item.isLink ? (
              <Link key={idx} href={item.href!} className="flex flex-col p-3 sm:p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all group">
                <div className="w-8 h-8 rounded-full border border-[#3f3f46] flex items-center justify-center mb-3 text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <item.icon size={14} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-snug mb-3 flex-1 text-[11px]">{item.desc}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-white group-hover:gap-2 transition-all mt-auto">
                  {item.action} <ArrowRight size={12} />
                </div>
              </Link>
            ) : (
              <a key={idx} href={`mailto:${item.action}`} className="flex flex-col p-3 sm:p-4 rounded-xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all group">
                <div className="w-8 h-8 rounded-full border border-[#3f3f46] flex items-center justify-center mb-3 text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <item.icon size={14} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-snug mb-3 flex-1 text-[11px]">{item.desc}</p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-white group-hover:gap-2 transition-all mt-auto">
                  {item.action} <ArrowRight size={12} />
                </div>
              </a>
            )
          ))}
        </div>

        {/* Message Form & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-8 p-4 sm:p-6 bg-[#0a0a0a] border border-[#27272a] rounded-xl">
          {/* Left: Form */}
          <div className="lg:col-span-3 flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Send us a message</h2>
            <form className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  className="w-full bg-[#121212] border border-[#27272a] rounded-lg px-3 py-2 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors text-[11px] sm:text-xs"
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  className="w-full bg-[#121212] border border-[#27272a] rounded-lg px-3 py-2 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors text-[11px] sm:text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Subject *"
                required
                className="w-full bg-[#121212] border border-[#27272a] rounded-lg px-3 py-2 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors text-[11px] sm:text-xs"
              />
              <textarea
                placeholder="Your Message *"
                required
                rows={4}
                className="w-full bg-[#121212] border border-[#27272a] rounded-lg px-3 py-2 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors resize-none text-[11px] sm:text-xs"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5 group text-xs sm:text-[13px]"
              >
                Send Message <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[#71717a] text-[10px] sm:text-[11px] pt-1">
                <Lock size={12} />
                <span>Your information is safe with us. We don't share your data.</span>
              </div>
            </form>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-2 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#27272a] pt-4 lg:pt-0 lg:pl-6">
            <h3 className="text-sm sm:text-base font-bold mb-1.5">Our team is here to help.</h3>
            <p className="text-[#a1a1aa] leading-snug mb-4 text-[11px] sm:text-xs">
              Whether you're a developer, researcher, founder or enthusiast — we're listening.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Users size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5 text-xs">Real humans</h4>
                  <p className="text-[#a1a1aa] text-[11px]">Talk to our team, not bots.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Clock size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5 text-xs">Quick responses</h4>
                  <p className="text-[#a1a1aa] text-[11px]">We aim to respond within 24–48 hours.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <ShieldCheck size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-0.5 text-xs">Your privacy matters</h4>
                  <p className="text-[#a1a1aa] text-[11px]">We respect your data and privacy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-8 bg-[#0a0a0a] border border-[#27272a] rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {[
              "How can I submit my AI tool?",
              "Do you offer partnerships?",
              "Is AI Orbit free to use?",
              "How do I update my listing?",
              "Can I advertise on AI Orbit?",
              "Do you have an API?",
              "How long does it take to get listed?",
              "How do I report an issue?",
              "Still have questions?"
            ].map((faq, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-[#27272a] group cursor-pointer hover:border-[#52525b] transition-colors"
              >
                <span className="text-[11px] sm:text-xs font-medium text-[#e4e4e7] group-hover:text-white transition-colors">{faq}</span>
                <Plus size={14} className="text-[#71717a] group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
