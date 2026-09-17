import { describe, expect, it } from "vitest";
import { filterDirectoryNavCards } from "../GlobalHero";

describe("GlobalHero directory navigation", () => {
  it("omits Business from the directory nav strip", () => {
    const cards = filterDirectoryNavCards([
      { name: "New" },
      { name: "Tools" },
      { name: "Business" },
      { name: "Agents" },
    ]);

    expect(cards.map((card) => card.name)).toEqual([
      "New",
      "Tools",
      "Agents",
    ]);
  });
});
