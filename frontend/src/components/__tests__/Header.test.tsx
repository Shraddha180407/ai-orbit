import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../Header";

vi.mock("@/hooks/use-user", () => ({
  useUser: vi.fn(),
}));

import { useUser } from "@/hooks/use-user";
const mockUseUser = vi.mocked(useUser);

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Header", () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ user: null, isLoading: false } as any);
  });

  it("renders logo and brand name", () => {
    render(<Header />);
    expect(screen.getByText("AI Orbit")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Business AI")).toHaveAttribute("href", "/tools?category=business");
    expect(screen.getByText("Leaderboard")).toHaveAttribute("href", "/leaderboard");
    expect(screen.getByText("Resources")).toHaveAttribute("href", "/tools");
    expect(screen.getByText("Newsletter")).toHaveAttribute("href", "/#newsletter");
  });

  it("renders Submit Tool button", () => {
    render(<Header />);
    expect(screen.getByText("Submit Tool")).toHaveAttribute("href", "/tools");
  });

  it("shows Log In link when user is not authenticated", () => {
    render(<Header />);
    expect(screen.getByText("Log In")).toHaveAttribute("href", "/auth/signin");
  });

  it("shows Dashboard link when user is authenticated", () => {
    mockUseUser.mockReturnValue({ user: { name: "Test", role: "USER" }, isLoading: false } as any);
    render(<Header />);
    expect(screen.getByText("Dashboard")).toHaveAttribute("href", "/dashboard");
    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
  });

  it("shows loading skeleton when loading", () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: true } as any);
    render(<Header />);
    expect(screen.queryByText("Log In")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });
});
