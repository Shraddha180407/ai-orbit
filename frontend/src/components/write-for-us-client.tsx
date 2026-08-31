'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Globe2,
  Loader2,
  PenLine,
  Quote,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

const TOPICS = [
  'AI Research & Models',
  'Developer Tools & Infrastructure',
  'Applied AI & Automation',
  'Robotics & Intelligent Devices',
  'AI Policy, Safety & Ethics',
  'Startups, Funding & Enterprise AI',
  'Education & Future of Work',
  'Tutorials & Technical Guides',
];

const BENEFITS = [
  { icon: Globe2, tone: 'border-sky-400/30 bg-sky-400/10 text-sky-300', title: 'Reach curious builders', text: 'Share your perspective with founders, researchers, developers, and AI practitioners.' },
  { icon: Sparkles, tone: 'border-violet-400/30 bg-violet-400/10 text-violet-300', title: 'Build your authority', text: 'Publish thoughtful work under your name with an author profile and portfolio links.' },
  { icon: Users, tone: 'border-amber-400/30 bg-amber-400/10 text-amber-300', title: 'Join the ecosystem', text: 'Connect your ideas to the tools, models, companies, and people shaping AI.' },
];

const GUIDELINES = [
  ['Original', 'Submit work you created and have not published elsewhere.'],
  ['Useful', 'Give readers concrete insight, evidence, examples, or an actionable takeaway.'],
  ['Relevant', 'Keep the story focused on artificial intelligence and its real-world impact.'],
  ['Well sourced', 'Credit research, data, quotations, and third-party visuals accurately.'],
  ['Human-led', 'AI may assist your process, but your expertise and editorial judgment must lead.'],
  ['Non-promotional', 'Teach the reader first. Avoid sales pitches, backlink pieces, and disguised ads.'],
];

const PROCESS = [
  { number: '01', icon: Send, tone: 'bg-sky-400/10 text-sky-300', title: 'Send your pitch', text: 'Share the title, topic, author background, and an editable Google Docs link.' },
  { number: '02', icon: FileCheck2, tone: 'bg-violet-400/10 text-violet-300', title: 'Editorial review', text: 'We evaluate originality, accuracy, relevance, structure, and reader value.' },
  { number: '03', icon: PenLine, tone: 'bg-amber-400/10 text-amber-300', title: 'Refine together', text: 'If the story is a fit, our editors may request focused changes or supporting sources.' },
  { number: '04', icon: Globe2, tone: 'bg-emerald-400/10 text-emerald-300', title: 'Publish and amplify', text: 'Approved work is published on AI Orbit and shared with our community.' },
];

const PITCH_SIGNALS = [
  { icon: Sparkles, tone: 'bg-violet-400/10 text-violet-300', bar: 'bg-violet-400', label: 'Original insight', value: 'A perspective readers cannot get from a summary.' },
  { icon: FileCheck2, tone: 'bg-sky-400/10 text-sky-300', bar: 'bg-sky-400', label: 'Credible evidence', value: 'Sources, examples, data, or firsthand experience.' },
  { icon: BookOpen, tone: 'bg-amber-400/10 text-amber-300', bar: 'bg-amber-400', label: 'Clear takeaway', value: 'A useful idea readers can understand and apply.' },
  { icon: Users, tone: 'bg-emerald-400/10 text-emerald-300', bar: 'bg-emerald-400', label: 'Human relevance', value: 'Why the development matters beyond the headline.' },
];

type FormState = {
  fullName: string;
  email: string;
  socialProfileUrl: string;
  articleTitle: string;
  topic: string;
  googleDocsUrl: string;
  acceptedGuidelines: boolean;
  company: string;
};

const INITIAL_FORM: FormState = {
  fullName: '', email: '', socialProfileUrl: '', articleTitle: '', topic: '', googleDocsUrl: '',
  acceptedGuidelines: false, company: '',
};

const inputClass = 'w-full rounded-xl border border-[#303030] bg-[#111111] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-[#686868] hover:border-[#525252] focus:border-white focus:ring-2 focus:ring-white/10';

export function WriteForUsClient() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const nameParts = form.fullName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      setError('Please enter your full name, including your last name.');
      return;
    }

    const [firstName, ...lastNameParts] = nameParts;
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/writer-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName: lastNameParts.join(' '),
          email: form.email,
          country: 'Not provided',
          websiteUrl: form.socialProfileUrl,
          portfolioUrl: '',
          authorBio: 'Social profile provided through the simplified contributor submission form.',
          articleTitle: form.articleTitle,
          topic: form.topic,
          googleDocsUrl: form.googleDocsUrl,
          contributionFrequency: 'ONE_TIME',
          acceptedGuidelines: form.acceptedGuidelines,
          company: form.company,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not submit your pitch. Please try again.');
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not submit your pitch. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 overflow-hidden bg-black text-white selection:bg-white/20">
      <section className="relative border-b border-[#242424]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-5 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.25fr_.75fr] lg:px-8 lg:py-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#121212]/80 px-3 py-1.5 text-xs font-semibold text-[#e5e5e5]">
              <PenLine size={13} /> AI Orbit contributor program
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Ideas that move AI <span className="text-[#bdbdbd]">forward.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#a1a1aa] sm:text-lg">
              Bring your research, technical lessons, field experience, and informed opinions to a global community exploring the AI ecosystem.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a href="#submit-pitch" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-[#dedede]">
                Submit your pitch <ArrowRight size={15} />
              </a>
              <a href="#guidelines" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#353535] bg-[#111111] px-5 text-sm font-semibold text-[#d4d4d4] transition hover:border-[#666666] hover:text-white">
                Read the guidelines
              </a>
            </div>
          </div>

          <div className="relative min-h-[195px] sm:min-h-[215px] lg:min-h-[245px]">
            <div className="absolute inset-1 rotate-2 rounded-[24px] border border-[#292929] bg-[#0d0d0d] sm:rounded-[32px]" />
            <div className="absolute inset-1 -rotate-1 rounded-[24px] border border-[#3a3a3a] bg-gradient-to-br from-[#191919] to-[#0b0b0b] p-5 shadow-2xl sm:rounded-[32px] sm:p-7">
              <Quote className="text-[#d4d4d4]" size={28} />
              <p className="mt-4 text-lg font-semibold leading-7 tracking-tight text-[#f4f4f5] sm:text-xl sm:leading-8">
                The best AI writing doesn&apos;t just report what changed. It helps readers understand why it matters.
              </p>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-[#303030] pt-3 text-[10px] text-[#8f8f8f] sm:bottom-7 sm:left-7 sm:right-7 sm:pt-4 sm:text-xs">
                <span>AI Orbit Editorial</span>
                <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> Review in 2–3 days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#242424] bg-[#090909]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 divide-x divide-y divide-[#282828] px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
          {[['8', 'Editorial tracks'], ['2–3', 'Business-day review'], ['100%', 'Human reviewed'], ['Global', 'Contributor reach']].map(([value, label]) => (
            <div key={label} className="px-3 py-4 text-center">
              <p className="text-xl font-black text-white">{value}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#74747e]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-5 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bdbdbd]">Why contribute</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Make your expertise discoverable.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, tone, title, text }) => (
            <article key={title} className="group rounded-2xl border border-[#292929] bg-[#0d0d0d] p-4 transition hover:-translate-y-1 hover:border-[#5a5a5a] hover:bg-[#141414] sm:p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl border ${tone}`}><Icon size={19} /></div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#8f8f98]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#242424] bg-[#080808]">
        <div className="mx-auto grid max-w-[1240px] gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bdbdbd]">Topics we cover</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Write where your knowledge is deepest.</h2>
            <p className="mt-4 text-sm leading-6 text-[#8f8f98]">We value technical depth, practical experience, honest analysis, and fresh perspectives across the AI landscape.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TOPICS.map((topic, index) => (
              <div key={topic} className="flex items-center gap-3 rounded-xl border border-[#292929] bg-[#0e0e0e] px-4 py-3 text-sm font-medium text-[#d4d4d4]">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[11px] font-black text-black">{String(index + 1).padStart(2, '0')}</span>
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#242424]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid items-center gap-6 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bdbdbd]">The AI Orbit difference</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">Build your pitch around four signals.</h2>
              <p className="mt-3 text-sm leading-6 text-[#8f8f98]">We do not chase noise. Strong submissions combine a fresh point of view with proof, usefulness, and human impact.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PITCH_SIGNALS.map(({ icon: Icon, tone, bar, label, value }, index) => (
                <article key={label} className="group relative overflow-hidden rounded-2xl border border-[#303030] bg-gradient-to-br from-[#151515] to-[#0b0b0b] p-4">
                  <span className="absolute right-4 top-3 text-4xl font-black text-[#2c2c2c]">0{index + 1}</span>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon size={17} /></div>
                  <h3 className="mt-3 text-sm font-bold">{label}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#85858f]">{value}</p>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#303030]"><div className={`h-full w-3/4 rounded-full transition-all group-hover:w-full ${bar}`} /></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="guidelines" className="mx-auto max-w-[1240px] scroll-mt-24 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bdbdbd]">Editorial standards</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Writing guidelines</h2>
            <div className="mt-5 space-y-3">
              {GUIDELINES.map(([title, text]) => (
                <div key={title} className="flex gap-3 rounded-xl border border-[#292929] bg-[#0d0d0d] p-4">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={17} />
                  <div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-[#8f8f98]">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bdbdbd]">Not a fit</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Please don&apos;t pitch</h2>
            <div className="mt-5 rounded-2xl border border-[#3a3a3a] bg-[#101010] p-5">
              {['Copied or previously published articles', 'Product announcements disguised as editorial', 'Backlink-only and keyword-stuffed content', 'Unsupported claims or fabricated citations', 'Generic listicles without original analysis', 'Copyrighted media without permission'].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-[#2c2c2c] py-3 text-sm text-[#c4c4c4] last:border-0">
                  <X size={15} className="shrink-0 text-rose-400" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#242424] bg-[#080808]">
        <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-6 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bdbdbd]">What happens next</p><h2 className="mt-3 text-3xl font-bold tracking-tight">From pitch to publication</h2></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map(({ number, icon: Icon, tone, title, text }) => (
              <article key={number} className="relative rounded-2xl border border-[#292929] bg-[#0e0e0e] p-4">
                <div className="flex items-center justify-between"><span className="text-2xl font-black text-[#555555]">{number}</span><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon size={17} /></span></div>
                <h3 className="mt-3 text-base font-bold">{title}</h3><p className="mt-1.5 text-xs leading-5 text-[#8f8f98]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="submit-pitch" className="mx-auto max-w-[1040px] scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-5 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#bdbdbd]">Contributor application</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Submit your article pitch</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#8f8f98]">Share your idea and an editable Google Docs link. Our editorial team aims to respond within 2–3 business days.</p></div>

        {submitted ? (
          <div className="rounded-3xl border border-[#444444] bg-[#101010] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black"><Check size={26} /></div>
            <h3 className="mt-5 text-2xl font-bold">Your pitch is with our editors.</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#a3a3a3]">Thanks for contributing to AI Orbit. We&apos;ll contact you by email after reviewing your submission.</p>
            <button type="button" onClick={() => setSubmitted(false)} className="mt-6 rounded-xl border border-[#525252] px-4 py-2.5 text-sm font-semibold text-[#e5e5e5] hover:bg-[#1f1f1f]">Submit another pitch</button>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-3xl border border-[#292930] bg-[#0b0b0e] p-5 shadow-2xl sm:p-7">
            <div className="grid gap-4">
              <Field label="Full name" required><input className={inputClass} placeholder="First and last name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} minLength={3} maxLength={160} autoComplete="name" required /></Field>
              <Field label="Email" required><input className={inputClass} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" required /></Field>
              <Field label="Social profile" hint="LinkedIn, X/Twitter, or GitHub" required><input className={inputClass} type="url" placeholder="https://" value={form.socialProfileUrl} onChange={(e) => update('socialProfileUrl', e.target.value)} required /></Field>
              <Field label="Proposed article title" required><input className={inputClass} value={form.articleTitle} onChange={(e) => update('articleTitle', e.target.value)} minLength={8} maxLength={180} required /></Field>
              <Field label="Primary topic" required><select className={inputClass} value={form.topic} onChange={(e) => update('topic', e.target.value)} required><option value="">Select a topic</option>{TOPICS.map((topic) => <option key={topic}>{topic}</option>)}</select></Field>
              <Field label="Editable Google Docs link" hint="Anyone with the link can edit" required><input className={inputClass} type="url" placeholder="https://docs.google.com/document/d/..." value={form.googleDocsUrl} onChange={(e) => update('googleDocsUrl', e.target.value)} required /></Field>
              <div className="absolute -left-[9999px]" aria-hidden="true"><label>Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => update('company', e.target.value)} /></label></div>
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-[#27272d] bg-[#101013] p-4">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-white" checked={form.acceptedGuidelines} onChange={(e) => update('acceptedGuidelines', e.target.checked)} required />
              <span className="text-xs leading-5 text-[#a1a1aa]">I confirm this submission is original and agree to the AI Orbit writing guidelines and editorial review process.</span>
            </label>

            {error && <div role="alert" className="mt-5 rounded-xl border border-[#525252] bg-[#171717] px-4 py-3 text-sm text-[#e5e5e5]">{error}</div>}

            <button disabled={submitting} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-black transition hover:bg-[#dfdfdf] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting pitch…</> : <><Send size={16} /> Submit for review</>}
            </button>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-[#6f6f78]"><span className="inline-flex items-center gap-1.5"><ShieldCheck size={12} /> Secure submission</span><span className="inline-flex items-center gap-1.5"><FileCheck2 size={12} /> Human editorial review</span><span className="inline-flex items-center gap-1.5"><BookOpen size={12} /> Original work only</span></div>
          </form>
        )}
        <p className="mt-6 text-center text-xs text-[#737373]">Questions before submitting? <Link href="/contact" className="font-semibold text-[#d4d4d4] underline-offset-4 hover:text-white hover:underline">Contact the editorial team</Link>.</p>
      </section>
    </main>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center justify-between text-xs font-semibold text-[#d4d4d4]"><span>{label}{required && <span className="ml-1 text-white">*</span>}</span>{hint && <span className="font-normal text-[#737373]">{hint}</span>}</span>{children}</label>;
}
