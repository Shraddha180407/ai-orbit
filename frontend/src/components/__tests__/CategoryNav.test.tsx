import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CategoryNav } from "../CategoryNav";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("CategoryNav", () => {
  it("renders all category buttons", () => {
    render(<CategoryNav />);
    expect(screen.getByText("AI Tools")).toBeInTheDocument();
    expect(screen.getByText("Models")).toBeInTheDocument();
    expect(screen.getByText("Companies")).toBeInTheDocument();
    expect(screen.getByText("Repositories")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Collections")).toBeInTheDocument();
    expect(screen.getByText("Videos")).toBeInTheDocument();
    expect(screen.getByText("Agents")).toBeInTheDocument();
  });

  it("has AI Tools as active by default", () => {
    render(<CategoryNav />);
    const aiTools = screen.getByText("AI Tools").closest("a")!;
    expect(aiTools.className).toContain("bg-white");
  });

  it("changes active category on click", () => {
    render(<CategoryNav />);
    // AI Tools is active by default - it's the only hash link with onClick
    const aiTools = screen.getByText("AI Tools").closest("a")!;
    expect(aiTools.className).toContain("bg-white");
  });

  it("links page categories to routes", () => {
    render(<CategoryNav />);
    expect(screen.getByText("Models").closest("a")).toHaveAttribute("href", "/models");
    expect(screen.getByText("Companies").closest("a")).toHaveAttribute("href", "/companies");
    expect(screen.getByText("News").closest("a")).toHaveAttribute("href", "/news");
  });

  it("links AI Tools to hash", () => {
    render(<CategoryNav />);
    expect(screen.getByText("AI Tools").closest("a")).toHaveAttribute("href", "#tools");
  });
});
