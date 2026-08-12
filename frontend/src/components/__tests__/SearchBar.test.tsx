import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  it("renders search input with placeholder", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText("Search AI tools...")).toBeInTheDocument();
  });

  it("renders form with search action", () => {
    render(<SearchBar />);
    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/tools");
    expect(form).toHaveAttribute("method", "GET");
  });

  it("has sr-only label", () => {
    render(<SearchBar />);
    expect(screen.getByLabelText("Search AI tools")).toBeInTheDocument();
  });

  it("renders with default value", () => {
    render(<SearchBar defaultValue="react" />);
    expect(screen.getByDisplayValue("react")).toBeInTheDocument();
  });

  it("renders input with name q", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText("Search AI tools...")).toHaveAttribute("name", "q");
  });
});
