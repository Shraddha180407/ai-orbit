export type SubcategoryChip = {
  label: string;
  count: number;
};

export const SUBCATEGORIES: Record<string, SubcategoryChip[]> = {
  "image-creation": [
    { label: "Illustrations", count: 210 },
    { label: "Image editing", count: 180 },
    { label: "Product images", count: 92 },
    { label: "Background removal", count: 74 },
    { label: "Upscaling", count: 63 },
    { label: "Portraits", count: 58 },
    { label: "Fantasy images", count: 41 },
    { label: "Vector art", count: 33 },
    { label: "Funny images", count: 22 },
  ],
  "content-creation": [
    { label: "Blog posts", count: 210 },
    { label: "Ad copy", count: 140 },
    { label: "Paraphrasing", count: 118 },
    { label: "SEO content", count: 95 },
    { label: "Social captions", count: 80 },
    { label: "Product descriptions", count: 62 },
    { label: "Creative writing", count: 40 },
  ],
  "video-creation": [
    { label: "Talking avatars", count: 90 },
    { label: "Text to video", count: 75 },
    { label: "Video editing", count: 60 },
    { label: "Short clips", count: 34 },
    { label: "Captions", count: 28 },
    { label: "Voiceover", count: 19 },
  ],
  coding: [
    { label: "Code completion", count: 55 },
    { label: "App building", count: 44 },
    { label: "Debugging", count: 40 },
    { label: "Code review", count: 30 },
    { label: "Terminal agents", count: 24 },
    { label: "Test generation", count: 20 },
  ],
};

export function getSubcategories(categorySlug: string | undefined | null): SubcategoryChip[] {
  if (!categorySlug) return [];
  return SUBCATEGORIES[categorySlug] ?? [];
}