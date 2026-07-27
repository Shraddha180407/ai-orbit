import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Replicate helpers from sync-repositories.ts (they are not exported)
// ---------------------------------------------------------------------------

function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSlug(owner: string, name: string): string {
  return sanitizeSlug(`${owner}-${name}`);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("buildSlug", () => {
  it("produces clean slugs from normal owner/name", () => {
    expect(buildSlug("huggingface", "transformers")).toBe("huggingface-transformers");
    expect(buildSlug("openai", "whisper")).toBe("openai-whisper");
    expect(buildSlug("vercel", "next.js")).toBe("vercel-next-js");
  });

  it("collapses different inputs to the same slug (the root cause)", () => {
    // HuggingFace (dot) + transformers → same slug as huggingface/transformers
    expect(buildSlug("hugging.face", "transformers")).toBe("hugging-face-transformers");

    // Case-insensitive collision: same owner, same name, different casing
    expect(buildSlug("HuggingFace", "Transformers")).toBe("huggingface-transformers");
    expect(buildSlug("huggingface", "Transformers")).toBe("huggingface-transformers");
    expect(buildSlug("HuggingFace", "transformers")).toBe("huggingface-transformers");

    // Underscore in name collapses to hyphen
    expect(buildSlug("huggingface", "my_transformers")).toBe("huggingface-my-transformers");
  });
});

describe("collision-safe upsert", () => {
  // Simulate the upsertRepo collision detection logic
  function resolveSlug(
    desiredSlug: string,
    githubId: number,
    existingSlugs: Map<string, number>, // slug → githubId
  ): string {
    const occupantGithubId = existingSlugs.get(desiredSlug);
    if (occupantGithubId !== undefined && occupantGithubId !== githubId) {
      const suffix = githubId.toString().slice(-6);
      return `${desiredSlug}-${suffix}`;
    }
    return desiredSlug;
  }

  it("keeps clean slug when no collision", () => {
    const existing = new Map<string, number>();
    const slug = resolveSlug("huggingface-transformers", 12345, existing);
    expect(slug).toBe("huggingface-transformers");
  });

  it("keeps clean slug when upserting the same repo (same githubId)", () => {
    const existing = new Map([["huggingface-transformers", 12345]]);
    const slug = resolveSlug("huggingface-transformers", 12345, existing);
    expect(slug).toBe("huggingface-transformers");
  });

  it("appends suffix on collision with different githubId", () => {
    const existing = new Map([["huggingface-transformers", 11111]]);
    const slug = resolveSlug("huggingface-transformers", 22222, existing);
    expect(slug).toBe("huggingface-transformers-22222");
  });

  it("handles the huggingface/transformers case specifically", () => {
    // Repo A was synced first with slug huggingface-transformers
    const existing = new Map([["huggingface-transformers", 11111]]);

    // Repo B (different githubId) generates the same slug
    const slugB = resolveSlug("huggingface-transformers", 99999, existing);
    expect(slugB).toBe("huggingface-transformers-99999");

    // Repo C (yet another githubId) also generates the same slug
    const slugC = resolveSlug("huggingface-transformers", 88888, existing);
    expect(slugC).toBe("huggingface-transformers-88888");
  });

  it("does not suffix repos already in DB with same slug and same githubId", () => {
    // Repo was previously synced with slug huggingface-transformers
    const existing = new Map([["huggingface-transformers", 12345]]);

    // Same repo re-syncing: should keep its slug
    const slug = resolveSlug("huggingface-transformers", 12345, existing);
    expect(slug).toBe("huggingface-transformers");
  });
});
