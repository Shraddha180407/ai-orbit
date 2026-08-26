import React from "react";
import Link from "next/link";
import { ArrowRight, PlusCircle } from "lucide-react";

export default function SubmitAIPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-24 pb-12">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-center mt-20">
        <div className="w-16 h-16 bg-[#121212] border border-[#27272a] rounded-2xl flex items-center justify-center mx-auto mb-8">
          <PlusCircle size={32} className="text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Submit an AI Tool
        </h1>
        
        <p className="text-[#a1a1aa] text-lg leading-relaxed mb-12">
          We're currently building the submission portal. Check back soon to add your AI tool, agent, or company to the AI Orbit ecosystem.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors group"
        >
          Return to Home 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
