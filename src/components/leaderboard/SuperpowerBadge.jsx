import React from 'react';
import { Sparkles, Code2, Cpu, Globe, Unlock, Zap, Eye, Mic, Video, Layout } from 'lucide-react';

export default function SuperpowerBadge({ superpower, category, detail, compact = false }) {
  if (!superpower) return null;

  // Domain aesthetic color mapping
  const getColorScheme = () => {
    const text = (superpower + ' ' + (category || '')).toLowerCase();
    if (text.includes('code') || text.includes('coding')) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
        icon: Code2
      };
    }
    if (text.includes('open weight') || text.includes('uncensored')) {
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
        icon: Unlock
      };
    }
    if (text.includes('context') || text.includes('2m')) {
      return {
        bg: 'bg-blue-500/10 border-blue-500/25 text-blue-300',
        icon: Globe
      };
    }
    if (text.includes('speed') || text.includes('latency') || text.includes('voice')) {
      return {
        bg: 'bg-purple-500/10 border-purple-500/25 text-purple-300',
        icon: Zap
      };
    }
    if (text.includes('realism') || text.includes('photo') || text.includes('image')) {
      return {
        bg: 'bg-pink-500/10 border-pink-500/25 text-pink-300',
        icon: Eye
      };
    }
    if (text.includes('video') || text.includes('motion')) {
      return {
        bg: 'bg-teal-500/10 border-teal-500/25 text-teal-300',
        icon: Video
      };
    }
    if (text.includes('ui') || text.includes('prototype') || text.includes('frontend')) {
      return {
        bg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300',
        icon: Layout
      };
    }
    return {
      bg: 'bg-[#6E56CF]/10 border-[#6E56CF]/25 text-[#C4B5FD]',
      icon: Sparkles
    };
  };

  const { bg, icon: Icon } = getColorScheme();

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border ${bg}`}>
        <Icon size={10} className="shrink-0" />
        <span className="truncate max-w-[130px]">{superpower}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border ${bg}`}>
      <Icon size={10.5} className="shrink-0" />
      <span className="font-semibold">{superpower}</span>
      {detail && (
        <>
          <span className="opacity-40">•</span>
          <span className="opacity-80 font-mono text-[9.5px]">{detail}</span>
        </>
      )}
    </div>
  );
}
