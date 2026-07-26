import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUser } from "@/hooks/use-user";
import { renderHookWithQueryClient } from "./test-utils";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("useUser", () => {
  it("starts in loading state", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHookWithQueryClient(() => useUser());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("returns user data on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { name: "Test User", email: "test@test.com" } }),
    });

    const { result } = renderHookWithQueryClient(() => useUser());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual({ name: "Test User", email: "test@test.com" });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("returns null user on 401", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHookWithQueryClient(() => useUser());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeDefined();
  });

  it("returns null user on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHookWithQueryClient(() => useUser());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("provides an update function", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { name: "User" } }),
    });

    const { result } = renderHookWithQueryClient(() => useUser());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.update).toBe("function");
  });

  it("calls fetch with credentials include", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({}),
    });

    renderHookWithQueryClient(() => useUser());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/me"),
      expect.objectContaining({ credentials: "include" })
    );
  });
});
