import { render, screen } from "@testing-library/react";
import { CategoryChip, TagChip } from "@/components/CategoryChip";

describe("CategoryChip", () => {
  it("renders as span when no href", () => {
    render(<CategoryChip label="Coding" />);
    const chip = screen.getByText("Coding");
    expect(chip.tagName).toBe("SPAN");
  });

  it("renders as link when href is provided", () => {
    render(<CategoryChip label="Coding" href="/tools?category=coding" />);
    const chip = screen.getByText("Coding");
    expect(chip.tagName).toBe("A");
    expect(chip).toHaveAttribute("href", "/tools?category=coding");
  });

  it("accepts custom className", () => {
    render(<CategoryChip label="Test" className="extra" />);
    expect(screen.getByText("Test")).toHaveClass("extra");
  });
});

describe("TagChip", () => {
  it("renders with # prefix as span when no href", () => {
    render(<TagChip label="react" />);
    const chip = screen.getByText("#react");
    expect(chip.tagName).toBe("SPAN");
  });

  it("renders as link with # prefix when href is provided", () => {
    render(<TagChip label="react" href="/tags/react" />);
    const chip = screen.getByText("#react");
    expect(chip.tagName).toBe("A");
    expect(chip).toHaveAttribute("href", "/tags/react");
  });
});
