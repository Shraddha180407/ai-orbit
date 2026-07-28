"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right';
import Star from 'lucide-react/dist/esm/icons/star';

type StickyCTAProps = {
  name: string;
  logoUrl: string | null;
  websiteUrl: string;
  avgRating: number | null;
  reviewCount: number;
};

export function StickyCTA({ name, logoUrl, websiteUrl, avgRating, reviewCount }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA when header scrolls past viewport (~220px)
      if (window.scrollY > 220) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-border/80 bg-background/95 p-3.5 backdrop-blur-lg shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex items-center justify-between md:hidden animate-slideUp transition-all duration-300">
      <div className="flex items-center gap-3 min-w-0">
        {/* Logo container */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-white p-1">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${name} mini logo`}
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-sm font-bold text-neutral-900 select-none">
              {name.charAt(0)}
            </span>
          )}
        </div>

        {/* Text information */}
        <div className="min-w-0">
          <div className="text-sm font-bold text-foreground truncate">{name}</div>
          {avgRating !== null && (
            <div className="flex items-center gap-1 text-[10px] text-pricing-trial">
              <Star size={10} className="fill-pricing-trial text-pricing-trial" />
              <span className="font-bold">{avgRating.toFixed(1)}</span>
              <span className="text-foreground-faint">({reviewCount})</span>
            </div>
          )}
        </div>
      </div>

      <a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center gap-1 text-xs font-bold text-black bg-accent px-3.5 py-2 rounded-lg shadow-md shadow-accent/20 hover:bg-accent-hover transition-all active:scale-95"
      >
        Visit
        <ArrowUpRight size={13} />
      </a>
    </div>
  );
}
