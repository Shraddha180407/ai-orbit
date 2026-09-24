import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import Bot from "lucide-react/dist/esm/icons/bot";
import Check from "lucide-react/dist/esm/icons/check";
import Cpu from "lucide-react/dist/esm/icons/cpu";
import GitBranch from "lucide-react/dist/esm/icons/git-branch";
import Layers3 from "lucide-react/dist/esm/icons/layers-3";
import Search from "lucide-react/dist/esm/icons/search";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import Waypoints from "lucide-react/dist/esm/icons/waypoints";

import { GlobalHero } from "@/components/GlobalHero";

import styles from "./orbit.module.css";

export const metadata: Metadata = {
  title: "AI Orbit — Navigate the AI Ecosystem",
  description:
    "A clearer way to discover AI tools, companies, models, and the people building what comes next.",
};

const orbitPaths = [
  {
    label: "Discover",
    title: "Start with the signal",
    description:
      "Search the ecosystem by tool, task, company, model, or the problem you are trying to solve.",
    href: "/tools",
    cta: "Explore the directory",
    icon: Search,
  },
  {
    label: "Understand",
    title: "Put the pieces in context",
    description:
      "Move from a promising result to a useful shortlist with profiles, comparisons, and practical detail.",
    href: "/models",
    cta: "Compare what matters",
    icon: Waypoints,
  },
  {
    label: "Keep moving",
    title: "Follow the next orbit",
    description:
      "Save the things worth returning to and stay close to the teams, tools, and ideas shaping AI.",
    href: "/news",
    cta: "See what is changing",
    icon: Sparkles,
  },
];

const ecosystemLinks = [
  { label: "AI tools", href: "/tools", detail: "Find the right tool for the job.", icon: Layers3 },
  { label: "AI agents", href: "/agents", detail: "Explore systems that can act.", icon: Bot },
  { label: "AI models", href: "/models", detail: "Compare the engines underneath.", icon: Cpu },
  { label: "Repositories", href: "/repositories", detail: "See what builders are shipping.", icon: GitBranch },
];

const faqs = [
  {
    question: "What is AI Orbit?",
    answer:
      "AI Orbit is a living directory for the AI ecosystem: tools, agents, models, companies, devices, repositories, news, and more in one place.",
  },
  {
    question: "Who is AI Orbit for?",
    answer:
      "It is for anyone trying to make sense of AI: curious builders, teams evaluating tools, researchers, founders, and people looking for a better starting point.",
  },
  {
    question: "Can I submit an AI product?",
    answer:
      "Yes. Use Submit Tool to add a product or project to the ecosystem and help keep the directory useful for everyone.",
  },
  {
    question: "Where should I begin?",
    answer:
      "Start with the search above, browse by category, or jump straight to Tasks if you know what you want AI to help you do.",
  },
];

function OrbitLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.inlineLink}>
      <span>{children}</span>
      <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  );
}

export default function OrbitPage() {
  return (
    <div className={styles.orbitPage}>
      <div className={styles.heroWrap}>
        <Suspense fallback={<div className={styles.heroFallback} />}>
          <GlobalHero />
        </Suspense>
      </div>

      <main>
        <section className={styles.introSection} aria-labelledby="orbit-intro-title">
          <div className={styles.sectionContainer}>
            <div className={styles.introGrid}>
              <div>
                <p className={styles.eyebrow}>The AI Orbit</p>
                <h2 id="orbit-intro-title" className={styles.displayHeading}>
                  The signal is everywhere. The path should be clear.
                </h2>
              </div>
              <div className={styles.introCopy}>
                <p>
                  AI Orbit is a calmer way into a fast-moving ecosystem. Find what is
                  useful, understand what you are looking at, and keep the next move
                  close at hand.
                </p>
                <div className={styles.actionRow}>
                  <Link href="/tools" className={styles.primaryButton}>
                    Explore AI Orbit <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <OrbitLink href="/submit">Add something to the orbit</OrbitLink>
                </div>
              </div>
            </div>

            <div className={styles.signalRail} aria-label="AI Orbit directory categories">
              <span className={styles.railLead}>One place to move through</span>
              {[
                "Tools",
                "Agents",
                "Models",
                "Companies",
                "Devices",
                "Robots",
                "Repositories",
                "MCP",
              ].map((item) => (
                <span key={item} className={styles.railItem}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.orbitMapSection} aria-labelledby="orbit-map-title">
          <div className={styles.sectionContainer}>
            <div className={styles.mapGrid}>
              <div className={styles.mapCopy}>
                <p className={styles.eyebrow}>A map, not a maze</p>
                <h2 id="orbit-map-title" className={styles.sectionHeading}>
                  Start anywhere. Go deeper when it matters.
                </h2>
                <p className={styles.bodyCopy}>
                  The ecosystem is too broad for one list and too useful to leave
                  scattered. AI Orbit gives each layer a clear place, so a search can
                  become a decision instead of another open tab.
                </p>
                <OrbitLink href="/search">Search the full ecosystem</OrbitLink>
              </div>

              <div className={styles.orbitDiagram} aria-label="A diagram showing connected AI Orbit categories">
                <div className={styles.diagramGlow} />
                <div className={`${styles.orbitRing} ${styles.orbitRingOuter}`} />
                <div className={`${styles.orbitRing} ${styles.orbitRingInner}`} />
                <div className={`${styles.diagramNode} ${styles.nodeTools}`}>Tools</div>
                <div className={`${styles.diagramNode} ${styles.nodeAgents}`}>Agents</div>
                <div className={`${styles.diagramNode} ${styles.nodeModels}`}>Models</div>
                <div className={`${styles.diagramNode} ${styles.nodeBuilders}`}>Builders</div>
                <div className={styles.diagramCore}>
                  <span>AI</span>
                  <strong>ORBIT</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.pathsSection} aria-labelledby="paths-title">
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.eyebrow}>Your next move</p>
                <h2 id="paths-title" className={styles.sectionHeading}>
                  A useful path through the noise.
                </h2>
              </div>
              <p className={styles.sectionHeaderCopy}>
                Good discovery is not just finding more. It is knowing what to do with
                what you found.
              </p>
            </div>

            <div className={styles.pathList}>
              {orbitPaths.map((path, index) => {
                const Icon = path.icon;

                return (
                  <Link href={path.href} key={path.label} className={styles.pathRow}>
                    <span className={styles.pathIndex}>0{index + 1}</span>
                    <span className={styles.pathIcon}>
                      <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span className={styles.pathContent}>
                      <span className={styles.pathLabel}>{path.label}</span>
                      <strong>{path.title}</strong>
                      <span>{path.description}</span>
                    </span>
                    <span className={styles.pathCta}>
                      {path.cta} <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.ecosystemSection} aria-labelledby="ecosystem-title">
          <div className={styles.sectionContainer}>
            <div className={styles.ecosystemGrid}>
              <div>
                <p className={styles.eyebrow}>Built around how you look</p>
                <h2 id="ecosystem-title" className={styles.sectionHeading}>
                  Browse the ecosystem by the question behind it.
                </h2>
              </div>
              <div className={styles.ecosystemLinks}>
                {ecosystemLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link href={item.href} key={item.label} className={styles.ecosystemLink}>
                      <span className={styles.ecosystemIcon}>
                        <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.detail}</small>
                      </span>
                      <ArrowRight size={16} strokeWidth={1.7} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.sectionContainer}>
            <div className={styles.faqGrid}>
              <div>
                <p className={styles.eyebrow}>Questions, answered</p>
                <h2 id="faq-title" className={styles.sectionHeading}>
                  Less hunting. More finding.
                </h2>
                <p className={styles.bodyCopy}>
                  A few places to begin if you are new to AI Orbit.
                </p>
              </div>
              <div className={styles.faqList}>
                {faqs.map((faq) => (
                  <details key={faq.question} className={styles.faqItem}>
                    <summary>
                      <span>{faq.question}</span>
                      <span className={styles.faqIcon} aria-hidden="true">+</span>
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection} aria-labelledby="cta-title">
          <div className={styles.ctaOrb} />
          <div className={styles.sectionContainer}>
            <div className={styles.ctaInner}>
              <div>
                <p className={styles.eyebrow}>Keep exploring</p>
                <h2 id="cta-title" className={styles.ctaHeading}>
                  The next useful thing is already in orbit.
                </h2>
              </div>
              <div className={styles.ctaAside}>
                <p>
                  Search the directory, follow a thread, or put your own work in front
                  of the people looking for it.
                </p>
                <div className={styles.actionRow}>
                  <Link href="/tools" className={styles.lightButton}>
                    Explore the directory <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                  <Link href="/submit" className={styles.ctaTextLink}>
                    Submit a tool <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className={styles.ctaRule}>
              <span><Check size={14} aria-hidden="true" /> Real tools. Real context.</span>
              <span>AI Orbit</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
