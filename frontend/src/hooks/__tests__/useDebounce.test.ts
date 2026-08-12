import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update before delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    // Change the value
    rerender({ value: "world" });

    // Before the timer fires, it should still be the initial value
    expect(result.current).toBe("hello");

    // Advance time but not enough
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("hello");
  });

  it("updates after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "hello" } }
    );

    rerender({ value: "world" });

    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("world");
  });

  it("resets timer on rapid changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("a"); // not yet

    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("a"); // timer was reset

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("c"); // now it fires
  });

  it("uses default delay of 300ms", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("b");
  });

  it("handles non-string values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 42 } }
    );

    expect(result.current).toBe(42);

    rerender({ value: 100 });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe(100);
  });
});
