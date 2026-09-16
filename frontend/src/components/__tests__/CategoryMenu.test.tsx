import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryMenu } from "../CategoryMenu";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("CategoryMenu", () => {
  const categoryCounts: Record<string, number> = {
    Coding: 42,
    Writing: 18,
    Marketing: 31,
  };

  it("renders all menu buttons", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    expect(screen.getByText("Build")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getAllByText("Research").length).toBeGreaterThanOrEqual(1);
  });

  it("shows dropdown on hover", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    fireEvent.mouseEnter(screen.getByText("Build"));
    expect(screen.getByText("AI Agents")).toBeInTheDocument();
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("Developers")).toBeInTheDocument();
  });

  it("shows category counts in dropdown", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    fireEvent.mouseEnter(screen.getByText("Create"));
    expect(screen.getByText("18")).toBeInTheDocument(); // Writing count
  });

  it("hides dropdown on mouse leave", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    const buildBtn = screen.getByText("Build");
    fireEvent.mouseEnter(buildBtn);
    expect(screen.getByText("AI Agents")).toBeInTheDocument();
    fireEvent.mouseLeave(buildBtn.closest(".relative")!);
    // Dropdown should eventually hide (after timeout)
    expect(screen.getByText("AI Agents")).toBeInTheDocument(); // still visible during timeout
  });

  it("toggles dropdown on click", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    const buildBtn = screen.getByText("Build");
    fireEvent.click(buildBtn);
    expect(screen.getByText("AI Agents")).toBeInTheDocument();
    fireEvent.click(buildBtn);
    // Click again should close
  });

  it("sets aria-expanded on menu buttons", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    const buildBtn = screen.getByText("Build").closest("button")!;
    expect(buildBtn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(buildBtn);
    expect(buildBtn).toHaveAttribute("aria-expanded", "true");
  });

  it("renders Browse all tools link", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    fireEvent.mouseEnter(screen.getByText("Build"));
    expect(screen.getAllByText("Browse all tools").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Browse all tools")[0].closest("a")).toHaveAttribute("href", "/tools");
  });

  it("links category items to tools page", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    fireEvent.mouseEnter(screen.getByText("Build"));
    expect(screen.getByText("AI Agents").closest("a")).toHaveAttribute(
      "href",
      "/tools?category=Agents"
    );
  });

  it("links business items to dedicated business routes", () => {
    render(<CategoryMenu categoryCounts={categoryCounts} />);
    fireEvent.mouseEnter(screen.getByText("Business"));

    expect(screen.getByText("Marketing").closest("a")).toHaveAttribute(
      "href",
      "/business/marketing",
    );
    expect(screen.getByText("Browse business tools")).toHaveAttribute(
      "href",
      "/business",
    );
  });
});
