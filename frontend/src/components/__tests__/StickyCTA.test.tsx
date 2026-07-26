import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { StickyCTA } from "../StickyCTA";

vi.mock("next/image", () => ({
  default: (props: any) => <img src={props.src} alt={props.alt} />,
}));

describe("StickyCTA", () => {
  const defaultProps = {
    name: "TestTool",
    logoUrl: null,
    websiteUrl: "https://example.com",
    avgRating: 4.5,
    reviewCount: 120,
  };

  let scrollY = 0;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollY = 0;
    Object.defineProperty(window, "scrollY", {
      get: () => scrollY,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not render when scroll is below threshold", () => {
    render(<StickyCTA {...defaultProps} />);
    scrollY = 100;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.queryByText("TestTool")).not.toBeInTheDocument();
  });

  it("renders when scroll exceeds threshold", () => {
    render(<StickyCTA {...defaultProps} />);
    scrollY = 250;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.getByText("TestTool")).toBeInTheDocument();
  });

  it("hides when scroll returns below threshold", () => {
    render(<StickyCTA {...defaultProps} />);
    scrollY = 250;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.getByText("TestTool")).toBeInTheDocument();
    scrollY = 100;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.queryByText("TestTool")).not.toBeInTheDocument();
  });

  it("renders visit link", () => {
    render(<StickyCTA {...defaultProps} />);
    scrollY = 250;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.getByText("Visit").closest("a")).toHaveAttribute("href", "https://example.com");
  });

  it("renders rating when available", () => {
    render(<StickyCTA {...defaultProps} />);
    scrollY = 250;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(120)")).toBeInTheDocument();
  });

  it("does not render rating when null", () => {
    render(<StickyCTA {...defaultProps} avgRating={null} />);
    scrollY = 250;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.queryByText("4.5")).not.toBeInTheDocument();
  });

  it("renders logo initial when no logoUrl", () => {
    render(<StickyCTA {...defaultProps} />);
    scrollY = 250;
    act(() => { window.dispatchEvent(new Event("scroll")); });
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});
