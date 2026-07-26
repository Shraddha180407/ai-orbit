import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReviewForm } from "../ReviewForm";

vi.mock("@/lib/actions", () => ({
  submitReview: vi.fn(),
}));

describe("ReviewForm", () => {
  it("renders rating stars", () => {
    render(<ReviewForm toolId="t1" toolSlug="test" />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
  });

  it("renders review textarea", () => {
    render(<ReviewForm toolId="t1" toolSlug="test" />);
    expect(screen.getByLabelText("Your review")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What did you use it for, and how did it go?")).toBeInTheDocument();
  });

  it("renders submit button disabled initially (no rating)", () => {
    render(<ReviewForm toolId="t1" toolSlug="test" />);
    expect(screen.getByText("Submit review")).toBeDisabled();
  });

  it("enables submit button when star is clicked", () => {
    render(<ReviewForm toolId="t1" toolSlug="test" />);
    fireEvent.click(screen.getByLabelText("4 stars"));
    expect(screen.getByText("Submit review")).not.toBeDisabled();
  });

  it("sets rating on star click", () => {
    render(<ReviewForm toolId="t1" toolSlug="test" />);
    fireEvent.click(screen.getByLabelText("3 stars"));
    expect(screen.getByLabelText("3 stars")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("2 stars")).toHaveAttribute("aria-checked", "false");
  });

  it("renders hidden inputs for toolId and toolSlug", () => {
    render(<ReviewForm toolId="t1" toolSlug="my-tool" />);
    const toolIdInput = screen.getByDisplayValue("t1");
    const toolSlugInput = screen.getByDisplayValue("my-tool");
    expect(toolIdInput).toBeInTheDocument();
    expect(toolSlugInput).toBeInTheDocument();
    expect(toolIdInput).toHaveAttribute("type", "hidden");
  });

  it("renders star rating label", () => {
    render(<ReviewForm toolId="t1" toolSlug="test" />);
    expect(screen.getByText("Your rating")).toBeInTheDocument();
    expect(screen.getByText("Your review")).toBeInTheDocument();
  });
});
