import { render, screen } from "@testing-library/react";
import { ProsConsVerdict } from "@/components/ProsConsVerdict";

describe("ProsConsVerdict", () => {
  it("renders default pros and cons for unknown category", () => {
    render(
      <ProsConsVerdict
        name="TestTool"
        description="A tool"
        features={[]}
        categories={[{ category: { slug: "unknown", name: "Unknown" } }]}
      />
    );
    expect(screen.getByText("Pros")).toBeInTheDocument();
    expect(screen.getByText("Cons")).toBeInTheDocument();
    expect(screen.getByText("Antigravity Verdict")).toBeInTheDocument();
    expect(screen.getByText(/Boosts daily productivity/)).toBeInTheDocument();
  });

  it("renders coding-specific pros for coding category", () => {
    render(
      <ProsConsVerdict
        name="CodeAI"
        description="AI coding"
        features={[]}
        categories={[{ category: { slug: "coding", name: "Coding" } }]}
      />
    );
    expect(screen.getByText(/Incredible context-aware code suggestions/)).toBeInTheDocument();
  });

  it("renders chatbots pros for chatbots category", () => {
    render(
      <ProsConsVerdict
        name="ChatBot"
        description="Chat"
        features={[]}
        categories={[{ category: { slug: "chatbots", name: "Chatbots" } }]}
      />
    );
    expect(screen.getByText(/Advanced multi-turn reasoning/)).toBeInTheDocument();
  });

  it("renders image-generation pros", () => {
    render(
      <ProsConsVerdict
        name="ImageGen"
        description="Image"
        features={[]}
        categories={[{ category: { slug: "image-generation", name: "Image Gen" } }]}
      />
    );
    expect(screen.getByText(/Industry-leading image fidelity/)).toBeInTheDocument();
  });

  it("renders writing/marketing pros", () => {
    render(
      <ProsConsVerdict
        name="WriterAI"
        description="Writing"
        features={[]}
        categories={[{ category: { slug: "writing", name: "Writing" } }]}
      />
    );
    expect(screen.getByText(/eliminates writer's block/)).toBeInTheDocument();
  });

  it("renders video/audio pros", () => {
    render(
      <ProsConsVerdict
        name="VideoAI"
        description="Video"
        features={[]}
        categories={[{ category: { slug: "video", name: "Video" } }]}
      />
    );
    expect(screen.getByText(/Ultra-realistic voice synthesis/)).toBeInTheDocument();
  });

  it("renders productivity pros", () => {
    render(
      <ProsConsVerdict
        name="TaskTool"
        description="Productivity"
        features={[]}
        categories={[{ category: { slug: "productivity", name: "Productivity" } }]}
      />
    );
    expect(screen.getByText(/Centralizes search across/)).toBeInTheDocument();
  });

  it("includes tool name in verdict", () => {
    render(
      <ProsConsVerdict
        name="MyTool"
        description="Desc"
        features={[]}
        categories={[{ category: { slug: "coding", name: "Coding" } }]}
      />
    );
    expect(screen.getByText(/MyTool/)).toBeInTheDocument();
  });
});
