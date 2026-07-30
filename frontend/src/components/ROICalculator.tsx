"use client";

import { useState } from "react";
import Calculator from 'lucide-react/dist/esm/icons/calculator';
import Hourglass from 'lucide-react/dist/esm/icons/hourglass';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import type { PricingModel } from "@/lib/types";

type ROICalculatorProps = {
  pricingModel: PricingModel;
  pricingAmount: string | null;
  name: string;
};

export function ROICalculator({ pricingModel, pricingAmount, name }: ROICalculatorProps) {
  const [teamSize, setTeamSize] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(40);
  const [hoursSaved, setHoursSaved] = useState(3);

  // Determine monthly cost per user
  let costPerUser = 0;
  if (pricingModel === "PAID") {
    costPerUser = pricingAmount ? parseFloat(pricingAmount) : 29;
  } else if (pricingModel === "FREEMIUM") {
    costPerUser = pricingAmount ? parseFloat(pricingAmount) : 15; // fallback for premium tier
  } else if (pricingModel === "FREE_TRIAL") {
    costPerUser = pricingAmount ? parseFloat(pricingAmount) : 20; // fallback after trial
  }

  const monthlyHoursSaved = Math.round(teamSize * hoursSaved * 4.33); // 4.33 weeks per month average
  const valueOfTimeSaved = monthlyHoursSaved * hourlyRate;
  const totalToolCost = teamSize * costPerUser;
  const netSavings = valueOfTimeSaved - totalToolCost;
  const roiMultiplier = totalToolCost > 0 ? (valueOfTimeSaved / totalToolCost).toFixed(1) : "100+";

  return (
    <div className="rounded-xl border border-border/80 bg-surface/30 p-4 md:p-6 backdrop-blur-md shadow-2xl shadow-black/40 relative">
      {/* Custom range slider thumb overrides for touch targets */}
      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          background: #4F46E5 !important; /* accent primary */
          cursor: pointer !important;
          border: 2px solid #ffffff !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4) !important;
          transition: transform 0.1s ease !important;
        }
        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.2) !important;
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px !important;
          height: 22px !important;
          border-radius: 50% !important;
          background: #4F46E5 !important;
          cursor: pointer !important;
          border: 2px solid #ffffff !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4) !important;
          transition: transform 0.1s ease !important;
        }
        input[type="range"]::-moz-range-thumb:active {
          transform: scale(1.2) !important;
        }
      `}</style>

      <div className="flex items-center gap-2.5 mb-6">
        <Calculator className="text-accent h-5 w-5" />
        <div>
          <h3 className="text-base font-semibold text-foreground">ROI & Savings Calculator</h3>
          <p className="text-xs text-foreground-faint">Estimate the impact of adopting {name} for your team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sliders Input */}
        <div className="space-y-6 lg:col-span-7">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="team-size-slider" className="font-medium text-foreground-muted">Team Size</label>
              <span className="font-semibold text-accent">{teamSize} {teamSize === 1 ? "person" : "people"}</span>
            </div>
            <input
              id="team-size-slider"
              type="range"
              min="1"
              max="50"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent py-2 bg-transparent"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="hourly-rate-slider" className="font-medium text-foreground-muted">Average Hourly Wage</label>
              <span className="font-semibold text-accent">{hourlyRate === 150 ? "+$150/hr" : `$${hourlyRate}/hr`}</span>
            </div>
            <input
              id="hourly-rate-slider"
              type="range"
              min="15"
              max="150"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseInt(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent py-2 bg-transparent"
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="hours-saved-slider" className="font-medium text-foreground-muted">Weekly Hours Saved Per Member</label>
              <span className="font-semibold text-accent">{hoursSaved} hrs/week</span>
            </div>
            <input
              id="hours-saved-slider"
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={hoursSaved}
              onChange={(e) => setHoursSaved(parseFloat(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent py-2 bg-transparent"
            />
          </div>
        </div>

        {/* Live Calculation Results */}
        <div className="grid grid-cols-2 gap-3 xs:gap-4 lg:col-span-5">
          <div className="rounded-lg border border-border/60 bg-surface-raised/40 p-3 xs:p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-foreground-faint uppercase font-semibold tracking-wide">
              <Hourglass size={12} className="text-pricing-trial" />
              Time Saved
            </div>
            <div>
              <div className="text-xl xs:text-2xl font-bold text-foreground mt-2">{monthlyHoursSaved}h</div>
              <div className="text-[10px] text-foreground-muted">saved / month total</div>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-surface-raised/40 p-3 xs:p-4 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs text-foreground-faint uppercase font-semibold tracking-wide">
              <DollarSign size={12} className="text-pricing-free" />
              Tool Cost
            </div>
            <div>
              <div className="text-xl xs:text-2xl font-bold text-foreground mt-2">${totalToolCost}</div>
              <div className="text-[10px] text-foreground-muted">${costPerUser}/mo per member</div>
            </div>
          </div>

          <div className="col-span-2 rounded-lg border border-accent/20 bg-accent/5 p-3.5 xs:p-4 flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 pointer-events-none">
              <TrendingUp size={100} className="text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-foreground-faint uppercase font-semibold tracking-wide">
                <TrendingUp size={12} className="text-accent" />
                Net Savings
              </div>
              <div className="text-2xl xs:text-3xl font-extrabold text-foreground mt-1 truncate">
                ${netSavings.toLocaleString("en-US")}
              </div>
              <span className="text-[10px] xs:text-xs text-foreground-faint font-normal block">estimated monthly savings</span>
            </div>
            <div className="text-right shrink-0 ml-2">
              <div className="inline-flex items-center justify-center rounded-full bg-accent/15 px-2.5 py-1 text-[10px] xs:text-xs font-bold text-accent border border-accent/20">
                {roiMultiplier}x ROI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
