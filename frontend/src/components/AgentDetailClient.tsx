"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

type Agent = {
  id: string;
  slug: string;
  name: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string | null;
  category: string;
  categorySlug: string;
  primaryTask: string;
  pricingModel: string;
  pricingRaw?: string | null;
  hasApi: boolean;
  isOpenSource: boolean;
  isTrending: boolean;
  verified: boolean;
  compatibility: string[];
  source?: string | null;
  avgRating?: number | null;
  reviewCount?: number;
  upvoteCount?: number;
  views?: number;
  shortDescription?: string | null;
  longDescription?: string | null;
  features: string[];
  useCases: string[];
  integrations: string[];
  apiDocsUrl?: string | null;
  githubUrl?: string | null;
  provider?: string | null;
  providerWebsite?: string | null;
  releaseDate?: string | null;
  pros: string[];
  cons: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AgentDetailResponse = Agent & {
  similarAgents?: Agent[];
};

type AgentDetailClientProps = {
  slug: string;
};

const fallback = (value?: string | null) =>
  value && value.trim() ? value.trim() : "Not specified";

const formatPricing = (value?: string | null) => {
  if (!value) return "Not specified";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not specified";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
};

const formatFullDate = (value?: string | null) => {
  if (!value) return "Not specified";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "Not specified";

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const cleanUrl = (value?: string | null) =>
  value
    ? value.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

function AgentLogo({
  name,
  logoUrl,
  small = false,
}: {
  name: string;
  logoUrl?: string | null;
  small?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  const boxClass = small
    ? "h-12 w-12 rounded-xl text-lg"
    : "h-28 w-28 rounded-2xl text-3xl";

  if (!logoUrl || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center border border-[#29292D] bg-[#18181C] font-bold text-white ${boxClass}`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-[#29292D] bg-[#18181C] ${boxClass}`}
    >
      <img
        src={logoUrl}
        alt={name}
        className="h-full w-full object-contain p-2"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function SectionTitle({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <h2 className="text-[21px] font-bold tracking-tight text-white">
        {title}
      </h2>

      {typeof count === "number" && count > 0 && (
        <span className="rounded-full bg-[#17171A] px-2 py-0.5 text-[10px] font-semibold text-[#71717A]">
          {count}
        </span>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="min-w-0 flex-1 text-xs text-[#A1A1AA]">
        {label}
      </span>
      <span className="max-w-[58%] truncate text-right text-xs font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

export function AgentDetailClient({
  slug,
}: AgentDetailClientProps) {
  const router = useRouter();

  const [agent, setAgent] = useState<AgentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadAgent() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/v1/agents/${encodeURIComponent(slug)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Agent not found");
        }

        if (!cancelled) {
          setAgent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load agent"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAgent();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `/agents/${slug}`;
    }

    return `${window.location.origin}/agents/${slug}`;
  }, [slug]);

  async function handleShare() {
    try {
      if (navigator.share && agent) {
        await navigator.share({
          title: agent.name,
          text: agent.shortDescription || agent.description,
          url: pageUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // User may cancel native sharing.
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 pb-20 pt-5 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1450px] animate-pulse">
          <div className="mb-5 h-4 w-56 rounded bg-[#151518]" />

          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_335px]">
            <div className="h-[270px] rounded-2xl border border-[#202024] bg-[#101012]" />
            <div className="h-[650px] rounded-2xl border border-[#202024] bg-[#101012]" />
          </div>
        </div>
      </main>
    );
  }

  if (!agent) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-black px-6 text-white">
        <div className="text-center">
          <p className="max-w-xl text-sm text-[#71717A]">
            {error || "Agent not found"}
          </p>

          <button
            type="button"
            onClick={() => router.push("/agents")}
            className="mt-4 rounded-lg border border-[#29292D] bg-[#151518] px-4 py-2 text-sm font-semibold text-white hover:border-[#414146]"
          >
            Back to Agents
          </button>
        </div>
      </main>
    );
  }

  const features = agent.features || [];
  const useCases = agent.useCases || [];
  const integrations = agent.integrations || [];
  const compatibility = agent.compatibility || [];
  const pros = agent.pros || [];
  const cons = agent.cons || [];
  const similarAgents = agent.similarAgents || [];

  return (
    <main className="min-h-screen bg-black px-4 pb-20 pt-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 overflow-hidden text-xs text-[#71717A]">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="shrink-0 hover:text-white"
          >
            Home
          </button>

          <span>›</span>

          <button
            type="button"
            onClick={() => router.push("/agents")}
            className="shrink-0 hover:text-white"
          >
            Agents
          </button>

          <span>›</span>

          <span className="truncate text-[#D4D4D8]">
            {agent.name}
          </span>
        </div>

        {/* Sidebar and hero share the exact same top edge */}
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_335px]">
          {/* LEFT CONTENT */}
          <div className="min-w-0">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-2xl border border-[#202024] bg-[#101012] px-7 py-7 sm:px-8 sm:py-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_20%,rgba(118,104,58,0.14),transparent_34%)]" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[38px]">
                    {agent.name}
                  </h1>

                  {agent.verified && (
                    <span
                      title="Verified agent"
                      className="text-[18px] text-[#8F75FF]"
                    >
                      ✓
                    </span>
                  )}
                </div>

                <div className="mt-3 inline-flex rounded-full border border-[#29292D] bg-[#18181B] px-3 py-1 text-[11px] font-semibold text-[#D4D4D8]">
                  AI Agent
                </div>

                <p className="mt-5 max-w-5xl text-sm leading-6 text-[#A1A1AA] sm:text-[15px]">
                  {fallback(
                    agent.shortDescription || agent.description
                  )}
                </p>

                <div className="mt-7 border-t border-[#242428] pt-6">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#66666E]">
                        Provider
                      </p>
                      <p className="mt-1.5 truncate text-xs font-semibold text-white">
                        {fallback(agent.provider)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#66666E]">
                        Pricing
                      </p>
                      <p className="mt-1.5 text-xs font-semibold text-white">
                        {formatPricing(agent.pricingModel)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#66666E]">
                        API Available
                      </p>
                      <p className="mt-1.5 text-xs font-semibold text-white">
                        {agent.hasApi ? "Yes" : "No"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#66666E]">
                        Focus
                      </p>
                      <p className="mt-1.5 truncate text-xs font-semibold text-white">
                        {fallback(agent.primaryTask)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#66666E]">
                        Release Date
                      </p>
                      <p className="mt-1.5 text-xs font-semibold text-white">
                        {formatDate(agent.releaseDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#66666E]">
                        Category
                      </p>
                      <p className="mt-1.5 truncate text-xs font-semibold text-white">
                        {fallback(agent.category)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ABOUT */}
            {agent.longDescription && (
              <section className="mt-7">
                <SectionTitle title="About" />

                <div className="rounded-2xl border border-[#202024] bg-[#101012] px-5 py-5 sm:px-6">
                  <p className="text-sm leading-7 text-[#A1A1AA]">
                    {agent.longDescription}
                  </p>
                </div>
              </section>
            )}

            {/* FEATURES */}
            {features.length > 0 && (
              <section className="mt-7">
                <SectionTitle
                  title="Key Features"
                  count={features.length}
                />

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {features.map((feature, index) => (
                    <div
                      key={`${feature}-${index}`}
                      className="flex min-h-[78px] items-center gap-3 rounded-xl border border-[#202024] bg-[#111113] p-4 transition-colors hover:border-[#303036]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#30265B] bg-[#1D1834] text-sm font-bold text-[#9B7CFF]">
                        {index + 1}
                      </div>

                      <p className="text-sm font-semibold leading-5 text-[#E4E4E7]">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* USE CASES */}
            {useCases.length > 0 && (
              <section className="mt-7">
                <SectionTitle
                  title="Use Cases"
                  count={useCases.length}
                />

                <div className="grid max-w-[1100px] gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                  {useCases.map((useCase, index) => (
                    <div
                      key={`${useCase}-${index}`}
                      className="flex h-[58px] items-center rounded-xl border border-[#202024] bg-[#111113] px-4 transition-colors hover:border-[#303036]"
                    >
                      <p className="text-sm font-semibold leading-5 text-[#E4E4E7]">
                        {useCase}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* INTEGRATIONS */}
            {integrations.length > 0 && (
              <section className="mt-7">
                <SectionTitle
                  title="Integrations"
                  count={integrations.length}
                />

                <div className="flex flex-wrap gap-2">
                  {integrations.map((integration) => (
                    <span
                      key={integration}
                      className="rounded-xl border border-[#232326] bg-[#121214] px-3.5 py-2.5 text-xs font-medium text-[#D4D4D8]"
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* COMPATIBILITY */}
            {compatibility.length > 0 && (
              <section className="mt-7">
                <SectionTitle
                  title="Compatibility"
                  count={compatibility.length}
                />

                <div className="flex flex-wrap gap-2">
                  {compatibility.map((item) => (
                    <span
                      key={item}
                      className="rounded-xl border border-[#232326] bg-[#121214] px-3.5 py-2.5 text-xs font-medium text-[#D4D4D8]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* PROS / CONS */}
            {(pros.length > 0 || cons.length > 0) && (
              <section className="mt-7">
                <SectionTitle title="Pros & Cons" />

                <div className="grid gap-3 md:grid-cols-2">
                  {pros.length > 0 && (
                    <div className="rounded-2xl border border-[#202024] bg-[#101012] p-5">
                      <h3 className="mb-4 text-sm font-semibold text-white">
                        Pros
                      </h3>

                      <div className="space-y-3">
                        {pros.map((pro) => (
                          <div
                            key={pro}
                            className="flex gap-2.5 text-xs leading-5 text-[#A1A1AA]"
                          >
                            <span className="mt-0.5 shrink-0 text-[#9B7CFF]">
                              ✓
                            </span>
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cons.length > 0 && (
                    <div className="rounded-2xl border border-[#202024] bg-[#101012] p-5">
                      <h3 className="mb-4 text-sm font-semibold text-white">
                        Cons
                      </h3>

                      <div className="space-y-3">
                        {cons.map((con) => (
                          <div
                            key={con}
                            className="flex gap-2.5 text-xs leading-5 text-[#A1A1AA]"
                          >
                            <span className="mt-0.5 shrink-0 text-[#71717A]">
                              ×
                            </span>
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SIMILAR AGENTS */}
            {similarAgents.length > 0 && (
              <section className="mt-8">
                <SectionTitle
                  title="Similar Agents"
                  count={similarAgents.length}
                />

                <div className="grid gap-3 md:grid-cols-2">
                  {similarAgents.map((similar) => (
                    <button
                      key={similar.id}
                      type="button"
                      onClick={() =>
                        router.push(`/agents/${similar.slug}`)
                      }
                      className="flex items-center gap-3 rounded-xl border border-[#232326] bg-[#121214] p-4 text-left transition-colors hover:border-[#39393E]"
                    >
                      <AgentLogo
                        name={similar.name}
                        logoUrl={similar.logoUrl}
                        small
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {similar.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-[#71717A]">
                          {fallback(
                            similar.primaryTask ||
                              similar.category
                          )}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="overflow-hidden rounded-2xl border border-[#202024] bg-[#101012] lg:sticky lg:top-6">
            <div className="flex flex-col items-center border-b border-[#202024] px-6 pb-6 pt-6 text-center">
              <AgentLogo
                name={agent.name}
                logoUrl={agent.logoUrl}
              />

              <h2 className="mt-5 text-lg font-bold text-white">
                {agent.name}
              </h2>

              {agent.verified && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span className="text-[#8F75FF]">✓</span>
                  Verified Agent
                </div>
              )}

              {agent.websiteUrl && (
                <a
                  href={agent.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex w-full items-center gap-2 text-left text-xs text-[#A1A1AA] hover:text-white"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {cleanUrl(agent.websiteUrl)}
                  </span>
                  <span aria-hidden="true" className="ml-1 inline-block text-[10px] leading-none text-[#66666E]">↗︎</span>
                </a>
              )}

              <div className="mt-5 grid w-full gap-2">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#6E56CF] text-xs font-semibold text-white hover:bg-[#7B62DE]"
                >
                  Save Agent
                </button>

                {agent.websiteUrl && (
                  <a
                    href={agent.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-[#29292D] bg-[#151518] text-xs font-semibold text-[#E4E4E7] hover:border-[#414146] hover:text-white"
                  >
                    Visit Website
                    <span aria-hidden="true" className="ml-1 inline-block text-[10px] leading-none text-[#66666E]">↗︎</span>
                  </a>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {agent.apiDocsUrl && (
                    <a
                      href={agent.apiDocsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-[#29292D] bg-[#151518] text-xs font-semibold text-[#A1A1AA] hover:border-[#414146] hover:text-white"
                    >
                      API Docs
                      <span aria-hidden="true" className="ml-1 inline-block text-[10px] leading-none text-[#66666E]">↗︎</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleShare}
                    className={`inline-flex h-11 items-center justify-center rounded-xl border border-[#29292D] bg-[#151518] text-xs font-semibold text-[#A1A1AA] hover:border-[#414146] hover:text-white ${
                      !agent.apiDocsUrl ? "col-span-2" : ""
                    }`}
                  >
                    {copied ? "Copied" : "Share"}
                  </button>
                </div>
              </div>
            </div>

            {/* AGENT INFO */}
            <div className="border-b border-[#202024] px-6 py-5">
              <h3 className="mb-2 text-xs font-semibold text-[#D4D4D8]">
                Agent Info
              </h3>
              <InfoRow
                label="Provider"
                value={fallback(agent.provider)}
              />
              <InfoRow
                label="Category"
                value={fallback(agent.category)}
              />
              <InfoRow
                label="Pricing"
                value={formatPricing(agent.pricingModel)}
              />
              <InfoRow
                label="API Available"
                value={agent.hasApi ? "Yes" : "No"}
              />
              <InfoRow
                label="Release Date"
                value={formatDate(agent.releaseDate)}
              />
              <InfoRow
                label="Open Source"
                value={agent.isOpenSource ? "Yes" : "No"}
              />
              <InfoRow
                label="Focus"
                value={fallback(agent.primaryTask)}
              />
            </div>

            {/* LINKS */}
            {(agent.providerWebsite ||
              agent.githubUrl ||
              agent.apiDocsUrl) && (
              <div className="border-b border-[#202024] px-6 py-5">
                <h3 className="mb-3 text-xs font-semibold text-[#D4D4D8]">
                  Links
                </h3>

                <div className="space-y-3">
                  {agent.providerWebsite && (
                    <a
                      href={agent.providerWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-xs text-[#A1A1AA] hover:text-white"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        Provider Website
                      </span>
                      <span aria-hidden="true" className="ml-1 inline-block text-[10px] leading-none text-[#66666E]">↗︎</span>
                    </a>
                  )}

                  {agent.githubUrl && (
                    <a
                      href={agent.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-xs text-[#A1A1AA] hover:text-white"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        GitHub
                      </span>
                      <span aria-hidden="true" className="ml-1 inline-block text-[10px] leading-none text-[#66666E]">↗︎</span>
                    </a>
                  )}

                  {agent.apiDocsUrl && (
                    <a
                      href={agent.apiDocsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 text-xs text-[#A1A1AA] hover:text-white"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        API Documentation
                      </span>
                      <span aria-hidden="true" className="ml-1 inline-block text-[10px] leading-none text-[#66666E]">↗︎</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ADDED */}
            {agent.createdAt && (
              <div className="px-6 py-5">
                <p className="text-xs font-medium text-[#8A8A93]">
                  Added to AIOrbit
                </p>

                <p className="mt-2 text-sm font-semibold text-white">
                  {formatFullDate(agent.createdAt)}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default AgentDetailClient;
