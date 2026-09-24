import type { Metadata } from "next";
import Link from "next/link";

import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Check from "lucide-react/dist/esm/icons/check";
import Layers3 from "lucide-react/dist/esm/icons/layers-3";
import Mail from "lucide-react/dist/esm/icons/mail";
import Megaphone from "lucide-react/dist/esm/icons/megaphone";
import Radio from "lucide-react/dist/esm/icons/radio";
import Search from "lucide-react/dist/esm/icons/search";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import Target from "lucide-react/dist/esm/icons/target";

import styles from "./advertise.module.css";

export const advertiseMetadata: Metadata = {
  title: "Advertise with AI Orbit",
  description:
    "Put your AI product in front of people exploring tools, models, companies, and projects on AI Orbit.",
};

const audienceCards = [
  {
    title: "Teams evaluating tools",
    description: "Show up when a shortlist is taking shape and the next click needs context.",
    icon: Search,
  },
  {
    title: "Builders looking for signal",
    description: "Reach people tracking new models, repositories, agents, and infrastructure.",
    icon: Layers3,
  },
  {
    title: "Founders shaping the category",
    description: "Give a new launch a useful home inside the ecosystem it belongs to.",
    icon: Target,
  },
];

const placements = [
  {
    tag: "01 / First impression",
    title: "Homepage spotlight",
    description: "A high-visibility placement for launches that need a clear, wide entry point.",
    bestFor: "New launches and major announcements",
    format: "Wide visual with a focused message",
    icon: Sparkles,
    visual: "spotlight",
    image: "/sc1.png",
  },
  {
    tag: "02 / In context",
    title: "Login feature",
    description: "Put your message beside the tools, models, and projects your audience is comparing.",
    bestFor: "Products with a clear category or use case",
    format: "Context-led feature near related discovery",
    icon: Radio,
    visual: "category",
    image: "/sc2.png",
  },
  {
    tag: "03 / Directory signal",
    title: "Featured listing",
    description: "Make your product easier to spot while people are actively browsing the directory.",
    bestFor: "Teams looking for qualified product discovery",
    format: "Prominent listing with a direct next step",
    icon: Megaphone,
    visual: "listing",
    image: "/sc3.png",
  },
  {
    tag: "04 / Editorial reach",
    title: "Newsletter feature",
    description: "Give your launch a considered introduction in the AI Orbit newsletter.",
    bestFor: "Stories that benefit from explanation and framing",
    format: "Short editorial introduction with a link",
    icon: BookOpen,
    visual: "newsletter",
    image: "/sc4.png",
  },
];

const reachSignals = [
  {
    label: "Discovery",
    title: "When a shortlist forms",
    description: "Reach people moving from broad research to a smaller set of options.",
  },
  {
    label: "Context",
    title: "Beside the right category",
    description: "Make the message easier to understand because it appears near related work.",
  },
  {
    label: "Action",
    title: "With a clear next step",
    description: "Point interested readers to the page, demo, signup, or launch you want them to see.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Tell us what you are launching",
    description: "Share the product, audience, timing, and the action you want people to take.",
  },
  {
    number: "02",
    title: "Choose the right surface",
    description: "We will help match your message to the placement that gives it useful context.",
  },
  {
    number: "03",
    title: "Go live with a clear brief",
    description: "Send the essentials. We shape the placement and keep the next step simple.",
  },
];

const faqs = [
  {
    question: "Who can advertise on AI Orbit?",
    answer:
      "AI products, infrastructure, services, publications, and teams building for the AI ecosystem can get in touch. We will help determine whether the audience and placement are a good fit.",
  },
  {
    question: "What placements are available?",
    answer:
      "Current options include homepage spotlight, category feature, featured listing, and newsletter feature placements. Reach out for the latest media kit and availability.",
  },
  {
    question: "Can you help with the creative?",
    answer:
      "Yes. Send the core facts and the action you want readers to take. We can help shape the message so it is clear in the surrounding AI Orbit experience.",
  },
  {
    question: "How do I get started?",
    answer:
      "Email the AI Orbit partnerships team with a short description of your launch and preferred timing. We will follow up with the next steps.",
  },
  {
    question: "What should I include in my inquiry?",
    answer:
      "Send your product URL, a short description of the audience you want to reach, your preferred timing, and the action you want readers to take. Existing creative is helpful but not required.",
  },
  {
    question: "Can placements be combined?",
    answer:
      "Some launches may suit more than one surface. We will recommend a focused combination based on your message, timing, and the context where it will be most useful.",
  },
];

const liveSurfaceUrl = "https://ai-orbit.online/ai-tools";

const ecosystemStats = [
  { value: "30K+", label: "LinkedIn Followers" },
  { value: "31K+", label: "YouTube Subscribers" },
  { value: "32K+", label: "Newsletter Subscribers" },
  { value: "50K+", label: "AI Tools & Resources" },
];

function PlacementVisual({ type, title, image }: { type: string; title: string; image: string }) {
  const slotClass = styles[`adSlot${type[0].toUpperCase()}${type.slice(1)}`];

  return (
    <div className={styles.placementVisual}>
      <div className={styles.liveSurfaceMeta}>
        <span>LIVE AI ORBIT SURFACE</span>
        <a href={liveSurfaceUrl} target="_blank" rel="noreferrer">
          Open directory <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
      <div className={styles.liveSurface}>
        <img
          src={image}
          alt={`AI Orbit ${title} placement screenshot`}
          loading="lazy"
        />
        <div className={`${styles.adSlot} ${slotClass}`}>
          <span>YOUR AD</span>
          <small>{title}</small>
        </div>
      </div>
    </div>
  );
}

export function AdvertiseLanding() {
  return (
    <div className={styles.adPage}>
      <div className={styles.adContainer}>
        <main id="top">
          <section className={styles.heroSection} aria-labelledby="advertise-title">
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Put your launch in context</p>
              <h1 id="advertise-title">
                <span className={styles.heroTitleLine}>Be found where AI</span>
                <span className={styles.heroTitleBreak}>decisions begin.</span>
              </h1>
              <p className={styles.heroDescription}>
                Put your product in front of people exploring the tools, models,
                companies, and ideas moving AI forward.
              </p>
              <div className={styles.heroActions}>
                <a href="#placements" className={styles.primaryButton}>
                  Explore placements <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a href="mailto:theaisignal.india@gmail.com?subject=Request%20the%20AI%20Orbit%20media%20kit" className={styles.textButton}>
                  Request the media kit <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className={styles.heroOrbit} aria-label="AI Orbit categories connected around a launch">
              <div className={styles.heroOrbitGlow} />
              <div className={`${styles.heroRing} ${styles.heroRingOne}`} />
              <div className={`${styles.heroRing} ${styles.heroRingTwo}`} />
              <span className={`${styles.orbitTag} ${styles.orbitTagTools}`}>Tools</span>
              <span className={`${styles.orbitTag} ${styles.orbitTagModels}`}>Models</span>
              <span className={`${styles.orbitTag} ${styles.orbitTagBuilders}`}>Builders</span>
              <span className={`${styles.orbitTag} ${styles.orbitTagNews}`}>News</span>
              <div className={styles.heroOrbitCore}>
                <span>YOUR</span>
                <strong>LAUNCH</strong>
              </div>
            </div>
          </section>

          <div className={styles.signalStrip} aria-label="AI Orbit discovery categories">
            <span className={styles.signalStripLead}>Reach across the orbit</span>
            <span>AI tools</span>
            <span>Agents</span>
            <span>Models</span>
            <span>Companies</span>
            <span>Repositories</span>
            <span>AI news</span>
          </div>

          <section className={styles.ecosystemProof} aria-labelledby="ecosystem-proof-title">
            <div className={styles.ecosystemProofIntro}>
              <h2 id="ecosystem-proof-title">Built for the AI ecosystem</h2>
              <p>Put your message in front of an audience already following what is next in AI.</p>
            </div>
            <div className={styles.ecosystemStats}>
              {ecosystemStats.map((stat) => (
                <div key={stat.label} className={styles.ecosystemStat}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="audience" className={styles.audienceSection} aria-labelledby="audience-title">
            <div className={styles.sectionIntro}>
              <div>
                <p className={styles.eyebrow}>Who you reach</p>
                <h2 id="audience-title">An audience with a job to do.</h2>
              </div>
              <p>
                AI Orbit is built for the moment after curiosity: when someone is
                looking for the right tool, the right system, or the next useful idea.
              </p>
            </div>

            <div className={styles.audienceGrid}>
              {audienceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className={styles.audienceCard}>
                    <span className={styles.cardIcon}><Icon size={19} strokeWidth={1.7} aria-hidden="true" /></span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                );
              })}
            </div>

            <div className={styles.reachBand}>
              {reachSignals.map((signal) => (
                <div key={signal.label} className={styles.reachItem}>
                  <span>{signal.label}</span>
                  <h3>{signal.title}</h3>
                  <p>{signal.description}</p>
                </div>
              ))}
            </div>

            <div className={styles.intentBand}>
              <div className={styles.intentVisual} aria-hidden="true">
                <span className={styles.intentDot} />
                <span className={styles.intentLine} />
                <span className={styles.intentDot} />
                <span className={styles.intentLine} />
                <span className={`${styles.intentDot} ${styles.intentDotBright}`} />
              </div>
              <p><strong>Context is the placement.</strong> Your message lands alongside the category it belongs to.</p>
              <a href="mailto:theaisignal.india@gmail.com?subject=Talk%20about%20an%20AI%20Orbit%20partnership" className={styles.bandLink}>
                Talk about a partnership <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </section>

          <section id="placements" className={styles.placementsSection} aria-labelledby="placements-title">
            <div className={styles.sectionIntro}>
              <div>
                <p className={styles.eyebrow}>Ad placements</p>
                <h2 id="placements-title">Four ways into the ecosystem.</h2>
              </div>
              <p>
                Choose the surface that matches your launch: a wide first impression,
                a category moment, a directory signal, or an editorial introduction.
              </p>
            </div>

            <div className={styles.placementList}>
              {placements.map((placement) => {
                const Icon = placement.icon;
                return (
                  <article key={placement.title} className={styles.placementRow}>
                    <div className={styles.placementCopy}>
                      <div className={styles.placementHeading}>
                        <span className={styles.placementIcon}><Icon size={17} strokeWidth={1.7} aria-hidden="true" /></span>
                        <span>{placement.tag}</span>
                      </div>
                      <h3>{placement.title}</h3>
                      <p>{placement.description}</p>
                      <dl className={styles.placementDetails}>
                        <div>
                          <dt>Best for</dt>
                          <dd>{placement.bestFor}</dd>
                        </div>
                        <div>
                          <dt>Format</dt>
                          <dd>{placement.format}</dd>
                        </div>
                      </dl>
                    </div>
                    <PlacementVisual type={placement.visual} title={placement.title} image={placement.image} />
                  </article>
                );
              })}
            </div>
          </section>

          <section id="process" className={styles.processSection} aria-labelledby="process-title">
            <div className={styles.processHeader}>
              <div>
                <p className={styles.eyebrow}>How it works</p>
                <h2 id="process-title">From brief to live, without the drift.</h2>
              </div>
              <p>Bring the signal. We will help it find the right orbit.</p>
            </div>

            <div className={styles.processList}>
              {processSteps.map((step) => (
                <div key={step.number} className={styles.processStep}>
                  <span className={styles.processNumber}>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.briefBand}>
              <div>
                <span className={styles.briefLabel}>WHAT TO INCLUDE</span>
                <h3>Bring the essentials. We will shape the rest.</h3>
              </div>
              <ul>
                <li><Check size={14} aria-hidden="true" /> Product or company URL</li>
                <li><Check size={14} aria-hidden="true" /> Audience and launch timing</li>
                <li><Check size={14} aria-hidden="true" /> The action you want readers to take</li>
              </ul>
            </div>
          </section>

          <section id="faq" className={styles.faqSection} aria-labelledby="faq-title">
            <div className={styles.faqGrid}>
              <div>
                <p className={styles.eyebrow}>Questions</p>
                <h2 id="faq-title">Make the next step easy.</h2>
                <p className={styles.faqIntro}>Start with the question you have. We can take it from there.</p>
              </div>
              <div className={styles.faqList}>
                {faqs.map((faq) => (
                  <details key={faq.question} className={styles.faqItem}>
                    <summary>
                      <span>{faq.question}</span>
                      <span className={styles.faqPlus} aria-hidden="true">+</span>
                    </summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.ctaSection} aria-labelledby="cta-title">
            <div className={styles.ctaOrb} />
            <div className={styles.ctaContent}>
              <div>
                <p className={styles.eyebrow}>Ready when you are</p>
                <h2 id="cta-title">Give your next launch a better place to land.</h2>
              </div>
              <div className={styles.ctaAside}>
                <p>Tell us what you are building, who it is for, and when it needs to be seen.</p>
                <a href="mailto:theaisignal.india@gmail.com?subject=Advertising%20with%20AI%20Orbit" className={styles.lightButton}>
                  Contact partnerships <Mail size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className={styles.ctaFooterLine}>
              <span><Check size={14} aria-hidden="true" /> AI Orbit partnerships</span>
              <span>theaisignal.india@gmail.com</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
