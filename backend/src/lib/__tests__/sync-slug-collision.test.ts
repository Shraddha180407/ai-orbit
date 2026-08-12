import { describe, it, expect } from "vitest";
import { buildRepoSlug, sanitizeSlug } from "../../lib/repository-helpers.js";

// ---------------------------------------------------------------------------
// Tests for shared repository slug helpers
// ---------------------------------------------------------------------------

describe("sanitizeSlug", () => {
  it("lowercases and replaces non-alphanumeric chars", () => {
    expect(sanitizeSlug("Hello World!")).toBe("hello-world");
    expect(sanitizeSlug("my_cool_repo")).toBe("my-cool-repo");
  });

  it("trims leading and trailing hyphens", () => {
    expect(sanitizeSlug("-hello-")).toBe("hello");
    expect(sanitizeSlug("---test---")).toBe("test");
  });
});

describe("buildRepoSlug", () => {
  it("produces clean slugs from normal owner/name", () => {
    expect(buildRepoSlug("huggingface", "transformers")).toBe("huggingface-transformers");
    expect(buildRepoSlug("openai", "whisper")).toBe("openai-whisper");
    expect(buildRepoSlug("vercel", "next.js")).toBe("vercel-next-js");
  });

  it("collapses different inputs to the same slug (the root cause)", () => {
    expect(buildRepoSlug("hugging.face", "transformers")).toBe("hugging-face-transformers");
    expect(buildRepoSlug("HuggingFace", "Transformers")).toBe("huggingface-transformers");
    expect(buildRepoSlug("huggingface", "Transformers")).toBe("huggingface-transformers");
    expect(buildRepoSlug("HuggingFace", "transformers")).toBe("huggingface-transformers");
    expect(buildRepoSlug("huggingface", "my_transformers")).toBe("huggingface-my-transformers");
  });
});

describe("collision-safe slug resolution", () => {
  function resolveSlug(
    desiredSlug: string,
    githubId: number,
    existingSlugs: Map<string, number>,
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
    const existing = new Map([["huggingface-transformers", 11111]]);

    const slugB = resolveSlug("huggingface-transformers", 99999, existing);
    expect(slugB).toBe("huggingface-transformers-99999");

    const slugC = resolveSlug("huggingface-transformers", 88888, existing);
    expect(slugC).toBe("huggingface-transformers-88888");
  });

  it("does not suffix repos already in DB with same slug and same githubId", () => {
    const existing = new Map([["huggingface-transformers", 12345]]);
    const slug = resolveSlug("huggingface-transformers", 12345, existing);
    expect(slug).toBe("huggingface-transformers");
  });
});
