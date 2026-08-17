import React from "react";
import Link from "next/link";
import LogIn from 'lucide-react/dist/esm/icons/log-in';

type TaskAuthRequiredProps = {
  message?: string;
};

export function TaskAuthRequired({ message }: TaskAuthRequiredProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl bg-gradient-to-b from-[#131316]/50 to-[#0D0D10]/50 ring-1 ring-[#232326]/70">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#18181C] to-[#0A0A0C] ring-1 ring-[#6E56CF]/30 flex items-center justify-center mb-4">
        <LogIn className="h-5 w-5 text-[#A78BFA]" aria-hidden="true" />
      </div>
      <p className="text-white text-sm font-semibold">Log in to see this</p>
      <p className="text-[#A1A1AA] text-xs mt-1.5 max-w-xs">
        {message || "Sign in to view tasks personalized to you."}
      </p>
      <Link
        href="/auth/signin"
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-[#7C63E0] to-[#6E56CF] hover:from-[#8A73EA] hover:to-[#7C63E0] transition-all duration-200 text-white text-xs font-semibold px-4 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        Sign In
      </Link>
    </div>
  );
}