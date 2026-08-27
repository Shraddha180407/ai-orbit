import React from "react";
import Link from "next/link";
import { ArrowRight, Edit3 } from "lucide-react";

export default function UpdateAIPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 pt-16 sm:pt-24 pb-12">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12 text-center mt-8 sm:mt-20">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#121212] border border-[#27272a] rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
          <Edit3 size={28} className="text-white" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
          Update AI Listing
        </h1>
        
        <p className="text-[#a1a1aa] text-base sm:text-lg leading-relaxed mb-8 sm:mb-12">
          The portal to update existing AI listings is currently under construction. Please check back soon.
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
