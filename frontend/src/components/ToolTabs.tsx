"use client";

import { useState } from "react";
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import Info from 'lucide-react/dist/esm/icons/info';
import Calculator from 'lucide-react/dist/esm/icons/calculator';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Building from 'lucide-react/dist/esm/icons/building';
import { cn } from "@/lib/utils";
import { ROICalculator } from "./ROICalculator";
import { ProsConsVerdict } from "./ProsConsVerdict";
import { RatingHistogram } from "./RatingHistogram";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import type { ReviewData } from "@/lib/types";
import type { PricingModel, BillingFrequency } from "@/lib/types";

type ToolTabsProps = {
  tool: {
    id: string;
    slug: string;
    name: string;
    description: string;
    features: string[];
    websiteUrl: string;
    pricingModel: PricingModel;
    pricingAmount: string | null;
    billingFrequency: BillingFrequency;
    createdAt: Date | string;
    releaseDate?: string | null;
    company: { slug: string; name: string } | null;
    categories: { category: { slug: string; name: string } }[];
    tags: { tag: { slug: string; name: string } }[];
    avgRating: number | null;
    reviewCount: number;
    isOpenSource?: boolean;
    compatibility?: string[];
    targetUsers?: string[];
    hasApi?: boolean;
    apiDocsUrl?: string | null;
  };
  reviews: ReviewData[];
};

export function ToolTabs({ tool, reviews }: ToolTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "roi" | "specs" | "reviews">("overview");

  const tabList = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "roi", label: "ROI Estimator", icon: Calculator },
    { id: "specs", label: "Specifications", icon: FileText },
    { id: "reviews", label: `Reviews (${reviews.length})`, icon: MessageSquare },
  ] as const;

  const formatDate = (dateVal: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(dateVal));
  };

  return (
    <div className="space-y-6 relative">
      <style jsx global>{`
        /* Hide scrollbars for the horizontal tab container */
        .scrollbar-none::-webkit-scrollbar {
          display: none !important;
        }
        .scrollbar-none {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* Premium Glassmorphic Tab switcher */}
      <div className="flex border-b border-border/80 overflow-x-auto scrollbar-none sticky top-0 bg-background/85 backdrop-blur-md z-10 py-2.5">
        <div className="flex gap-2 min-w-max px-1">
          {tabList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-xs xs:text-sm font-medium rounded-lg transition-all select-none active:scale-95 border",
                  isActive
                    ? "bg-accent/15 text-accent border-accent/25 shadow-[0_0_12px_rgba(79,70,229,0.15)] font-semibold"
                    : "text-foreground-muted hover:bg-surface-raised/40 hover:text-foreground border-transparent"
                )}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="transition-all duration-300">
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* About Section */}
            <section aria-labelledby="about-heading" className="space-y-3">
              <h2 id="about-heading" className="text-lg font-bold text-foreground">
                About {tool.name}
              </h2>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {tool.description}
              </p>
            </section>

            {/* Pros/Cons Summary Verdict */}
            <section aria-labelledby="verdict-heading">
              <h2 id="verdict-heading" className="text-lg font-bold text-foreground mb-3">
                Expert Analysis
              </h2>
              <ProsConsVerdict
                name={tool.name}
                description={tool.description}
                features={tool.features}
                categories={tool.categories}
              />
            </section>

            {/* Key Features List */}
            {tool.features.length > 0 && (
              <section aria-labelledby="features-heading" className="space-y-3">
                <h2 id="features-heading" className="text-lg font-bold text-foreground">
                  Key Features
                </h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {tool.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground-muted"
                    >
                      <Sparkles size={14} className="shrink-0 text-accent" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {activeTab === "roi" && (
          <div className="animate-fadeIn">
            <ROICalculator
              pricingModel={tool.pricingModel}
              pricingAmount={tool.pricingAmount}
              name={tool.name}
            />
          </div>
        )}

        {activeTab === "specs" && (
          <div className="rounded-xl border border-border bg-surface/30 p-4 md:p-6 backdrop-blur-md animate-fadeIn space-y-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FileText size={18} className="text-accent" />
              Technical Specifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tool.pricingModel && (
                <div className="flex items-center justify-between border-b border-border/40 py-2.5 text-sm">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Calculator size={14} className="text-foreground-faint" />
                    Pricing Structure
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {tool.pricingModel.toLowerCase().replace("_", " ")}
                  </span>
                </div>
              )}

              {(tool.pricingAmount || tool.pricingModel === "FREE") && (
                <div className="flex items-center justify-between border-b border-border/40 py-2.5 text-sm">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Globe size={14} className="text-foreground-faint" />
                    Base Cost
                  </span>
                  <span className="font-semibold text-foreground">
                    {tool.pricingAmount ? `$${tool.pricingAmount}` : "Free"}
                  </span>
                </div>
              )}

              {tool.company && (
                <div className="flex items-center justify-between border-b border-border/40 py-2.5 text-sm">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Building size={14} className="text-foreground-faint" />
                    Vendor Company
                  </span>
                  <span className="font-semibold text-foreground">{tool.company.name}</span>
                </div>
              )}

              {tool.releaseDate && (
                <div className="flex items-center justify-between border-b border-border/40 py-2.5 text-sm">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Info size={14} className="text-foreground-faint" />
                    Release Date
                  </span>
                  <span className="font-semibold text-foreground">{formatDate(tool.releaseDate)}</span>
                </div>
              )}
              
              {tool.isOpenSource !== undefined && tool.isOpenSource && (
                <div className="flex items-center justify-between border-b border-border/40 py-2.5 text-sm">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Info size={14} className="text-foreground-faint" />
                    Open Source
                  </span>
                  <span className="font-semibold text-foreground">Yes</span>
                </div>
              )}

              {tool.hasApi && (
                <div className="flex items-center justify-between border-b border-border/40 py-2.5 text-sm">
                  <span className="text-foreground-muted flex items-center gap-2">
                    <Info size={14} className="text-foreground-faint" />
                    API
                  </span>
                  <span className="font-semibold text-foreground">Available</span>
                </div>
              )}
            </div>

            {/* Tags Chip block */}
            {tool.tags.length > 0 && (
              <div className="pt-4 border-t border-border/40">
                <span className="block text-xs font-semibold uppercase tracking-wider text-foreground-faint mb-3">
                  Metadata tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map(({ tag }) => (
                    <span
                      key={tag.slug}
                      className="rounded bg-surface-raised border border-border px-2 py-0.5 text-xs text-foreground-muted select-none"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Histogram Stats Card */}
            <RatingHistogram
              reviews={reviews}
              avgRating={tool.avgRating}
              reviewCount={tool.reviewCount}
            />

            {/* Reviews Section */}
            <section aria-labelledby="reviews-heading" className="space-y-4">
              <h2 id="reviews-heading" className="text-lg font-bold text-foreground">
                User Reviews ({reviews.length})
              </h2>

              <div className="mb-4">
                <ReviewForm toolId={tool.id} toolSlug={tool.slug} />
              </div>

              <ReviewList reviews={reviews} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
