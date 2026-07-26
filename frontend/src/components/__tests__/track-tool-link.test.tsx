import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TrackToolLink } from "@/components/track-tool-link";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/api", () => ({
  API_URL: "https://api.test.com",
}));

describe("TrackToolLink", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders external link to tool URL", () => {
    render(
      <TrackToolLink toolId="t1" toolName="TestTool" url="https://example.com" />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("fires analytics POST on click", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
    } as Response);

    render(
      <TrackToolLink toolId="t1" toolName="TestTool" url="https://example.com" />
    );

    await user.click(screen.getByRole("link"));

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.test.com/api/history",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CLICK_TOOL",
          entity: "TestTool",
          entityId: "t1",
        }),
      })
    );
  });

  it("does not break on fetch error", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    render(
      <TrackToolLink toolId="t1" toolName="TestTool" url="https://example.com" />
    );

    await user.click(screen.getByRole("link"));
    // Should not throw
  });
});
