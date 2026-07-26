import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useExample } from "@/hooks/use-example";

describe("useExample", () => {
  it("returns ready: true", () => {
    const { result } = renderHook(() => useExample());
    expect(result.current).toEqual({ ready: true });
  });

  it("returns a stable reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useExample());
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });
});
