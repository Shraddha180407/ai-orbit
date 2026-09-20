import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroGeometric from "@/components/mvpblocks/geometric-hero";

describe("HeroGeometric", () => {
  it("uses the compact height and vertical spacing for the business hero", () => {
    const { container } = render(<HeroGeometric />);
    const hero = container.firstElementChild;
    const content = hero?.querySelector(".container");

    expect(hero).toHaveClass("min-h-[190px]", "sm:min-h-[220px]");
    expect(content).toHaveClass("py-5", "sm:py-6");
  });

  it("keeps the static workflow infographic behind the hero content", () => {
    const { container } = render(<HeroGeometric />);
    const infographic = screen.getByTestId("business-hero-infographic");
    const content = container.querySelector(
      '[data-testid="business-hero-content"]',
    );

    expect(infographic).toHaveAttribute("aria-hidden", "true");
    expect(infographic).toHaveClass(
      "absolute",
      "inset-0",
      "z-0",
      "pointer-events-none",
    );
    expect(infographic.querySelector("svg")).toBeInTheDocument();
    expect(content).toHaveClass("relative", "z-10");
  });

  it("keeps the mobile hero copy on one line and removes the CTA", () => {
    render(<HeroGeometric />);

    expect(
      screen.getByRole("heading", {
        name: "Find the right AI",
      }),
    ).toHaveClass("whitespace-nowrap");
    expect(
      screen.getByText(
        "Discover practical tools for growth, sales, support, and more.",
      ),
    ).toHaveClass("whitespace-nowrap");
    expect(
      screen.queryByRole("link", { name: /Explore business tools/i }),
    ).not.toBeInTheDocument();
  });
});
