import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Footer } from "../Footer";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Footer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders brand name", () => {
    render(<Footer />);
    expect(screen.getByText("The AI Signal")).toBeInTheDocument();
  });

  it("renders all link group headings", () => {
    render(<Footer />);
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Collections")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
  });

  it("renders newsletter form", () => {
    render(<Footer />);
    expect(screen.getByLabelText("Subscribe to newsletter")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("shows subscribed message on form submit", async () => {
    render(<Footer />);
    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByText(/you're subscribed/)).toBeInTheDocument();
  });

  it("hides subscribed message after timeout", () => {
    render(<Footer />);
    const input = screen.getByPlaceholderText("you@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByText(/you're subscribed/)).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.queryByText(/you're subscribed/)).not.toBeInTheDocument();
  });

  it("renders social media links", () => {
    render(<Footer />);
    expect(screen.getByLabelText("Twitter")).toHaveAttribute("href", "https://twitter.com");
    expect(screen.getByLabelText("GitHub")).toHaveAttribute("href", "https://github.com");
    expect(screen.getByLabelText("Discord")).toHaveAttribute("href", "https://discord.com");
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()} The AI Signal`))).toBeInTheDocument();
  });
});
