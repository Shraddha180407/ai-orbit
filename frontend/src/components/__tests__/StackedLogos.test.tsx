import { render, screen } from "@testing-library/react";
import { StackedLogos } from "@/components/StackedLogos";

vi.mock("@/components/ui/Logo", () => ({
  Logo: ({ name, ...props }: any) => <div data-testid="logo" data-name={name} {...props} />,
}));

describe("StackedLogos", () => {
  it("renders up to 4 logos", () => {
    const tools = [
      { logoUrl: null, name: "Tool A" },
      { logoUrl: null, name: "Tool B" },
      { logoUrl: null, name: "Tool C" },
      { logoUrl: null, name: "Tool D" },
      { logoUrl: null, name: "Tool E" },
    ];
    render(<StackedLogos tools={tools} />);
    const logos = screen.getAllByTestId("logo");
    expect(logos).toHaveLength(4);
  });

  it("renders fewer logos when less than 4 tools", () => {
    const tools = [
      { logoUrl: null, name: "Tool A" },
      { logoUrl: null, name: "Tool B" },
    ];
    render(<StackedLogos tools={tools} />);
    expect(screen.getAllByTestId("logo")).toHaveLength(2);
  });

  it("renders nothing when empty tools array", () => {
    const { container } = render(<StackedLogos tools={[]} />);
    expect(container.querySelectorAll('[data-testid="logo"]')).toHaveLength(0);
  });

  it("has aria-hidden for decorative purpose", () => {
    const { container } = render(<StackedLogos tools={[{ logoUrl: null, name: "T" }]} />);
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).toBeInTheDocument();
  });

  it("passes logo names to Logo component", () => {
    const tools = [{ logoUrl: "https://example.com/logo.png", name: "MyTool" }];
    render(<StackedLogos tools={tools} />);
    expect(screen.getByTestId("logo")).toHaveAttribute("data-name", "MyTool");
  });
});
