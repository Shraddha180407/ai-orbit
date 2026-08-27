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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-16 sm:pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-16 mb-16 sm:mb-24">
          <div className="w-full lg:w-1/2">
            <div className="mb-4 sm:mb-6 flex items-center gap-4">
              <h2 className="text-[12px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">
                CONTACT
              </h2>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]">
              Let's Connect.
            </h1>
            
            <p className="text-base sm:text-[18px] leading-relaxed text-[#e4e4e7] mb-2 max-w-[500px]">
              Have a question, found an issue, want to suggest an AI tool, or interested in working with AI Orbit?
            </p>
            <p className="text-base sm:text-[18px] leading-relaxed text-[#a1a1aa] mb-8 sm:mb-10 max-w-[500px]">
              We'd love to hear from you.
            </p>
            
            <div className="inline-flex items-center gap-3 sm:gap-4 bg-[#0a0a0a] border border-[#27272a] rounded-xl p-3 sm:p-4 pl-4 sm:pl-5 pr-6 sm:pr-8">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-[#3f3f46] flex items-center justify-center bg-[#121212] shrink-0">
                <Mail size={18} className="text-[#a1a1aa]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] sm:text-[13px] text-[#a1a1aa] font-medium">We usually reply within</span>
                <span className="text-sm sm:text-[16px] font-bold text-white">24–48 hours</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end hidden md:flex">
            <div className="relative w-full max-w-[450px] aspect-square rounded-full flex items-center justify-center">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { title: "General Enquiries", icon: MessageSquare, action: "theaisignal.india@gmail.com", isLink: false, desc: "Questions, feedback or anything else." },
            { title: "Submit an AI Tool", icon: Send, action: "Submit a Tool", isLink: true, href: "/submit", desc: "Have an AI tool that belongs on AI Orbit?" },
            { title: "Business & Partnerships", icon: Handshake, action: "theaisignal.india@gmail.com", isLink: false, desc: "Partnerships, collaborations and advertising." },
            { title: "Report an Issue", icon: Bug, action: "Report an Issue", isLink: true, href: "/report", desc: "Found a bug or something not working as expected?" },
          ].map((item, idx) => (
            item.isLink ? (
              <Link key={idx} href={item.href!} className="flex flex-col p-8 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all group">
                <div className="w-12 h-12 rounded-full border border-[#3f3f46] flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed mb-8 flex-1 text-[15px]">{item.desc}</p>
                <div className="flex items-center gap-2 text-[14px] font-medium text-white group-hover:gap-3 transition-all mt-auto">
                  {item.action} <ArrowRight size={16} />
                </div>
              </Link>
            ) : (
              <a key={idx} href={`mailto:${item.action}`} className="flex flex-col p-8 rounded-2xl bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] hover:bg-[#121212] transition-all group">
                <div className="w-12 h-12 rounded-full border border-[#3f3f46] flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <item.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-[#a1a1aa] leading-relaxed mb-8 flex-1 text-[15px]">{item.desc}</p>
                <div className="flex items-center gap-2 text-[14px] font-medium text-white group-hover:gap-3 transition-all mt-auto">
                  {item.action} <ArrowRight size={16} />
                </div>
              </a>
            )
          ))}
        </div>

        {/* Message Form & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24 mb-32 p-8 lg:p-12 bg-[#0a0a0a] border border-[#27272a] rounded-[32px]">
          {/* Left: Form */}
          <div className="lg:col-span-3 flex flex-col">
            <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your Name *" 
                  required
                  className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-5 py-4 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors text-[15px]"
                />
                <input 
                  type="email" 
                  placeholder="Your Email *" 
                  required
                  className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-5 py-4 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors text-[15px]"
                />
              </div>
              <input 
                type="text" 
                placeholder="Subject *" 
                required
                className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-5 py-4 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors text-[15px]"
              />
              <textarea 
                placeholder="Your Message *" 
                required
                rows={6}
                className="w-full bg-[#121212] border border-[#27272a] rounded-xl px-5 py-4 text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#71717a] transition-colors resize-none text-[15px]"
              ></textarea>
              <button 
                type="submit"
                className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group text-[15px]"
              >
                Send Message <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-2 text-[#71717a] text-[13px] pt-2">
                <Lock size={14} />
                <span>Your information is safe with us. We don't share your data.</span>
              </div>
            </form>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">Our team is here to help.</h3>
            <p className="text-[#a1a1aa] leading-relaxed mb-10 text-[15px]">
              Whether you're a developer, researcher, founder or enthusiast — we're listening.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Users size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Real humans</h4>
                  <p className="text-[#a1a1aa] text-[15px]">Talk to our team, not bots.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Quick responses</h4>
                  <p className="text-[#a1a1aa] text-[15px]">We aim to respond within 24–48 hours.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 rounded-full border border-[#3f3f46] flex items-center justify-center bg-[#121212]">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Your privacy matters</h4>
                  <p className="text-[#a1a1aa] text-[15px]">We respect your data and privacy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-24 bg-[#0a0a0a] border border-[#27272a] rounded-[32px] p-8 lg:p-12">
          <h2 className="text-2xl font-bold mb-10">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4">
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
                className="flex items-center justify-between py-4 border-b border-[#27272a] group cursor-pointer hover:border-[#52525b] transition-colors"
              >
                <span className="text-[15px] font-medium text-[#e4e4e7] group-hover:text-white transition-colors">{faq}</span>
                <Plus size={18} className="text-[#71717a] group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
