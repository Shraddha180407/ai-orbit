import { fireEvent, render, screen } from "@testing-library/react";
import { SearchModal } from "../SearchModal";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("@/hooks/useAutocomplete", () => ({
  useAutocomplete: () => ({ suggestions: [], popular: [], isLoading: false }),
}));

vi.mock("@/hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({ recent: [], addRecent: vi.fn(), clearRecent: vi.fn() }),
}));

describe("SearchModal", () => {
  beforeEach(() => {
    mockPush.mockClear();
    document.body.style.overflow = "auto";
  });

  it("exposes accessible dialog semantics", () => {
    render(<SearchModal open onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "search-dialog-title");
  });

  it("restores the previous body overflow value when closed", () => {
    const { rerender } = render(<SearchModal open onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");

    rerender(<SearchModal open={false} onClose={vi.fn()} />);

    expect(document.body.style.overflow).toBe("auto");
  });

  it("traps Tab from the last control back to the search input", () => {
    render(<SearchModal open onClose={vi.fn()} />);
    const input = screen.getByRole("textbox");
    const buttons = screen.getAllByRole("button");
    const lastControl = buttons[buttons.length - 1];
    lastControl.focus();

    fireEvent.keyDown(lastControl, { key: "Tab" });

    expect(input).toHaveFocus();
  });

  it("restores focus to the previously focused element after closing", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open search";
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(<SearchModal open onClose={vi.fn()} />);
    rerender(<SearchModal open={false} onClose={vi.fn()} />);

    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
