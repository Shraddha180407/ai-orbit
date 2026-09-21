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

  it("keeps the home page yellow signal tint in the hero background", () => {
    const { container } = render(<HeroGeometric />);
    const background = container.firstElementChild?.querySelector(
      '[aria-hidden="true"]',
    );

    expect(background?.className).toContain("rgba(245,166,35,0.14)");
  });

  it("does not render the decorative workflow infographic", () => {
    const { container } = render(<HeroGeometric />);
    const content = container.querySelector(
      '[data-testid="business-hero-content"]',
    );

    expect(
      screen.queryByTestId("business-hero-infographic"),
    ).not.toBeInTheDocument();
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
