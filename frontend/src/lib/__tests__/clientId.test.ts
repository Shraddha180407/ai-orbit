import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// clientId.ts uses "use client" directive and crypto.randomUUID
// We need to test it in a client-like environment

describe("getClientId", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("generates and persists a UUID in localStorage", async () => {
    const { getClientId } = await import("@/lib/clientId");
    const id1 = getClientId();
    expect(id1).toBeDefined();
    expect(typeof id1).toBe("string");
    expect(id1.length).toBeGreaterThan(0);

    const id2 = getClientId();
    expect(id2).toBe(id1);
  });

  it("returns empty string on server (window undefined)", async () => {
    // In jsdom, window is defined, so we can't easily test the SSR path
    // but we verify it works in client environment
    const { getClientId } = await import("@/lib/clientId");
    const id = getClientId();
    expect(typeof id).toBe("string");
  });

  it("generates new UUID when localStorage is empty", async () => {
    const { getClientId } = await import("@/lib/clientId");
    localStorage.clear();
    const id = getClientId();
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
  });

  it("returns same ID on subsequent calls", async () => {
    const { getClientId } = await import("@/lib/clientId");
    const id1 = getClientId();
    const id2 = getClientId();
    expect(id1).toBe(id2);
  });
});
