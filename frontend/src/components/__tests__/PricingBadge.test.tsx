import { render, screen } from "@testing-library/react";
import { PricingBadge } from "@/components/PricingBadge";

describe("PricingBadge", () => {
  it("renders FREE pricing", () => {
    render(<PricingBadge pricingModel="FREE" />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders FREEMIUM pricing", () => {
    render(<PricingBadge pricingModel="FREEMIUM" />);
    expect(screen.getByText("Freemium")).toBeInTheDocument();
  });

  it("renders PAID pricing", () => {
    render(<PricingBadge pricingModel="PAID" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders FREE_TRIAL pricing", () => {
    render(<PricingBadge pricingModel="FREE_TRIAL" />);
    expect(screen.getByText("Free Trial")).toBeInTheDocument();
  });

  it("renders amount with monthly frequency", () => {
    render(
      <PricingBadge
        pricingModel="PAID"
        pricingAmount="29"
        billingFrequency="MONTHLY"
      />
    );
    expect(screen.getByText(/\$29\/mo/)).toBeInTheDocument();
  });

  it("renders amount with yearly frequency", () => {
    render(
      <PricingBadge
        pricingModel="PAID"
        pricingAmount="199"
        billingFrequency="YEARLY"
      />
    );
    expect(screen.getByText(/\$199\/yr/)).toBeInTheDocument();
  });

  it("renders amount with one-time frequency", () => {
    render(
      <PricingBadge
        pricingModel="PAID"
        pricingAmount="49"
        billingFrequency="ONE_TIME"
      />
    );
    expect(screen.getByText(/\$49 one-time/)).toBeInTheDocument();
  });

  it("does not show amount for FREE pricing", () => {
    render(<PricingBadge pricingModel="FREE" pricingAmount="0" />);
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  it("does not show amount when pricingAmount is null", () => {
    render(<PricingBadge pricingModel="PAID" pricingAmount={null} />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("does not show amount when pricingAmount is 0", () => {
    render(<PricingBadge pricingModel="PAID" pricingAmount="0" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<PricingBadge pricingModel="FREE" className="test-class" />);
    const badge = screen.getByText("Free").closest("span");
    expect(badge).toHaveClass("test-class");
  });
});
