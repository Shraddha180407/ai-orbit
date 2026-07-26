import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskSearchBar } from "../TaskSearchBar";

describe("TaskSearchBar", () => {
  it("renders search input", () => {
    render(<TaskSearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Search tasks…")).toBeInTheDocument();
  });

  it("displays current value", () => {
    render(<TaskSearchBar value="test query" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
  });

  it("calls onChange on input change", () => {
    const onChange = vi.fn();
    render(<TaskSearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("Search tasks…"), { target: { value: "new" } });
    expect(onChange).toHaveBeenCalledWith("new");
  });

  it("shows clear button when value is non-empty", () => {
    render(<TaskSearchBar value="test" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("hides clear button when value is empty", () => {
    render(<TaskSearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("clears value on clear button click", () => {
    const onChange = vi.fn();
    render(<TaskSearchBar value="test" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
