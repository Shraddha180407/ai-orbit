import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  SearchModalProvider,
  useSearchModal,
} from "@/context/SearchModalContext";

function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(SearchModalProvider, null, children);
  };
}

describe("SearchModalProvider", () => {
  it("starts with modal closed", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("open sets isOpen to true", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it("close sets isOpen to false", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.open());
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it("open and close are referentially stable across re-renders", () => {
    const { result, rerender } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });
    const firstOpen = result.current.open;
    const firstClose = result.current.close;
    rerender();
    expect(result.current.open).toBe(firstOpen);
    expect(result.current.close).toBe(firstClose);
  });

  it("Ctrl+K shortcut opens the modal", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isOpen).toBe(false);

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
      );
    });
    expect(result.current.isOpen).toBe(true);
  });

  it("Meta+K shortcut opens the modal", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", metaKey: true })
      );
    });
    expect(result.current.isOpen).toBe(true);
  });

  it("Ctrl+K does not open when key is not 'k'", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "j", ctrlKey: true })
      );
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("plain 'k' without modifier does not open", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k" })
      );
    });
    expect(result.current.isOpen).toBe(false);
  });

  it("Ctrl+K opens modal even when already open", () => {
    const { result } = renderHook(() => useSearchModal(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
      );
    });
    expect(result.current.isOpen).toBe(true);
  });
});

describe("useSearchModal", () => {
  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderHook(() => useSearchModal());
    }).toThrow("useSearchModal must be used within a SearchModalProvider");
    spy.mockRestore();
  });
});
