import { describe, it, expect } from "vitest";
import { getCategoryIcon } from "@/lib/category-icons";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import Code2 from "lucide-react/dist/esm/icons/code-2";
import FileText from "lucide-react/dist/esm/icons/file-text";
import Search from "lucide-react/dist/esm/icons/search";
import Palette from "lucide-react/dist/esm/icons/palette";
import Megaphone from "lucide-react/dist/esm/icons/megaphone";
import Briefcase from "lucide-react/dist/esm/icons/briefcase";
import Headset from "lucide-react/dist/esm/icons/headset";
import ImageIcon from "lucide-react/dist/esm/icons/image";
import Video from "lucide-react/dist/esm/icons/video";
import Music from "lucide-react/dist/esm/icons/music";
import SearchCheck from "lucide-react/dist/esm/icons/search-check";
import MessageSquare from "lucide-react/dist/esm/icons/message-square";

describe("getCategoryIcon", () => {
  it("returns Sparkles for undefined", () => {
    expect(getCategoryIcon(undefined)).toBe(Sparkles);
  });

  it("returns Sparkles for null", () => {
    expect(getCategoryIcon(null)).toBe(Sparkles);
  });

  it("returns Sparkles for empty string", () => {
    expect(getCategoryIcon("")).toBe(Sparkles);
  });

  it("returns Sparkles for unknown category", () => {
    expect(getCategoryIcon("unknown-category")).toBe(Sparkles);
  });

  it("returns Code2 for coding", () => {
    expect(getCategoryIcon("coding")).toBe(Code2);
  });

  it("returns FileText for writing", () => {
    expect(getCategoryIcon("writing")).toBe(FileText);
  });

  it("returns Search for research", () => {
    expect(getCategoryIcon("research")).toBe(Search);
  });

  it("returns Palette for design", () => {
    expect(getCategoryIcon("design")).toBe(Palette);
  });

  it("returns Megaphone for marketing", () => {
    expect(getCategoryIcon("marketing")).toBe(Megaphone);
  });

  it("returns Briefcase for productivity", () => {
    expect(getCategoryIcon("productivity")).toBe(Briefcase);
  });

  it("returns Headset for customer-support", () => {
    expect(getCategoryIcon("customer-support")).toBe(Headset);
  });

  it("returns ImageIcon for image-generation", () => {
    expect(getCategoryIcon("image-generation")).toBe(ImageIcon);
  });

  it("returns Video for video", () => {
    expect(getCategoryIcon("video")).toBe(Video);
  });

  it("returns Music for audio", () => {
    expect(getCategoryIcon("audio")).toBe(Music);
  });

  it("returns SearchCheck for seo", () => {
    expect(getCategoryIcon("seo")).toBe(SearchCheck);
  });

  it("returns MessageSquare for chatbots", () => {
    expect(getCategoryIcon("chatbots")).toBe(MessageSquare);
  });
});
