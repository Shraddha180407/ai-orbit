import type { ToolCategory } from "./types.js";
import { TOOL_CATEGORIES } from "./types.js";
import { logger } from "./logger.js";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

interface GroqResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
}

export type CandidateVideo = {
  videoId: string;
  title: string;
  description: string;
};

/** "not-ai" is a drop signal only — it's filtered out before storage. */
type GateLabel = ToolCategory | "not-ai";
const GATE_LABELS: GateLabel[] = [...TOOL_CATEGORIES, "not-ai"];

export type GatedVideo = CandidateVideo & { toolCategory: ToolCategory };

const SYSTEM_PROMPT = `You are a strict content classifier for an AI-focused video feed.
For each video (given as title + description), classify it as exactly one of:
${GATE_LABELS.map((l) => `"${l}"`).join(" | ")}

Rules:
- "not-ai": video is not meaningfully about AI/ML (vlogs, unrelated tech, clickbait using "AI" loosely with no real AI content, etc). Use this liberally to keep the feed clean.
- "multimodal-ai": vision-language models, text-to-image/video/audio generation, any-to-any models, image/video generation tools.
- "llm": large language models, chatbots, prompting, fine-tuning, model releases that are primarily text-based LLMs.
- "agents": autonomous agents, agentic workflows, tool-use frameworks, multi-agent systems.
- "robotics": embodied AI, robots, physical-world AI systems.
- "general-ai": genuinely AI-related but doesn't fit the above (AI policy/news, general ML theory, AI hardware, etc).

Respond with ONLY a JSON array of strings, one label per input video, in the same order as given. No prose, no markdown fences.`;

function buildUserPrompt(batch: CandidateVideo[]): string {
  return JSON.stringify(
    batch.map((v) => ({
      title: v.title.slice(0, 150),
      description: (v.description ?? "").slice(0, 200),
    }))
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseLabels(raw: string, expected: number): GateLabel[] | null {
  try {
    const cleaned = raw.trim().replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
    const arr = JSON.parse(cleaned);
    if (!Array.isArray(arr) || arr.length !== expected) return null;
    return arr.map((label: string) => (GATE_LABELS.includes(label as GateLabel) ? (label as GateLabel) : "not-ai"));
  } catch {
    return null;
  }
}

async function classifyWithGemini(batch: CandidateVideo[]): Promise<GateLabel[] | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: buildUserPrompt(batch) }] }],
        generationConfig: { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 2048 },
      }),
    });

    if (res.status === 429) {
      // Free-tier RPM limit. Back off and retry rather than immediately
      // burning the Groq fallback for what's usually a transient limit.
      const waitMs = attempt * 5000;
      logger.warn(`[relevance-gate] Gemini 429 (attempt ${attempt}/${maxAttempts}) — waiting ${waitMs}ms`);
      await sleep(waitMs);
      continue;
    }

    if (!res.ok) {
      logger.error(`[relevance-gate] Gemini failed: ${res.status}`);
      return null;
    }

    const json = (await res.json()) as GeminiResponse;
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    return parseLabels(text, batch.length);
  }

  logger.error("[relevance-gate] Gemini still rate-limited after retries");
  return null;
}

async function classifyWithGroq(batch: CandidateVideo[]): Promise<GateLabel[] | null> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;

  // openai/gpt-oss-* models are reasoning models — they spend tokens on
  // internal reasoning before writing the answer, and were eating the
  // entire max_completion_tokens budget before producing any JSON
  // (empty failed_generation). llama-3.1-8b-instant answers directly with
  // no reasoning overhead, which is what we actually want for a one-shot
  // classification task. Swap via GROQ_MODEL if it gets deprecated again.
  const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
  const isReasoningModel = model.startsWith("openai/gpt-oss");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0,
      max_completion_tokens: isReasoningModel ? 8192 : 1024,
      ...(isReasoningModel ? { reasoning_effort: "low" } : {}),
      response_format: { type: "json_object" as const },
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\nRespond with a JSON object of the exact shape {"labels": ["label1", "label2", ...]} — nothing else, no explanation.`,
        },
        { role: "user", content: buildUserPrompt(batch) },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    logger.error(`[relevance-gate] Groq failed: ${res.status} ${body.slice(0, 300)}`);
    return null;
  }

  const json = (await res.json()) as GroqResponse;
  const content = json?.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    return parseLabels(JSON.stringify(parsed.labels ?? parsed), batch.length);
  } catch {
    return null;
  }
}

/**
 * Classifies a batch of candidate videos. Tries Gemini first, falls back to
 * Groq on failure. If both fail, "fails open": every video in the batch is
 * passed through as "general-ai" rather than silently dropping data — a
 * later ingest run can re-classify once the LLM providers recover.
 */
async function classifyBatch(batch: CandidateVideo[]): Promise<GateLabel[]> {
  const fromGemini = await classifyWithGemini(batch);
  if (fromGemini) return fromGemini;

  logger.warn("[relevance-gate] Gemini unavailable, falling back to Groq");
  const fromGroq = await classifyWithGroq(batch);
  if (fromGroq) return fromGroq;

  logger.warn("[relevance-gate] Gemini + Groq both unavailable — failing open as 'general-ai'");
  return batch.map(() => "general-ai" as GateLabel);
}

/**
 * Classifies all candidates and drops anything labeled "not-ai". This is
 * the sole gatekeeper standing between "any video the crawler found" and
 * "what actually reaches storage/the frontend".
 */
export async function gateVideos(candidates: CandidateVideo[]): Promise<GatedVideo[]> {
  const BATCH_SIZE = Number(process.env.RELEVANCE_GATE_BATCH_SIZE ?? 15);
  // Gemini free tier is 15 requests/minute = 1 request per 4s minimum.
  // Default to 4500ms so retries/jitter don't tip it over.
  const BATCH_DELAY_MS = Number(process.env.RELEVANCE_GATE_BATCH_DELAY_MS ?? 4500);

  const batches: CandidateVideo[][] = [];
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    batches.push(candidates.slice(i, i + BATCH_SIZE));
  }

  const gated: GatedVideo[] = [];

  for (let i = 0; i < batches.length; i++) {
    const labels = await classifyBatch(batches[i]);
    batches[i].forEach((video, j) => {
      const label = labels[j] ?? "not-ai";
      if (label === "not-ai") return;
      gated.push({ ...video, toolCategory: label });
    });

    if (i < batches.length - 1 && BATCH_DELAY_MS > 0) await sleep(BATCH_DELAY_MS);
  }

  return gated;
}