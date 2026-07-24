"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

import { API_URL } from "@/lib/api";

export async function toggleBookmark(toolId: string, toolSlug: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value || '';
    const res = await fetch(`${API_URL}/api/v1/tools/${toolSlug}/bookmark`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `auth_token=${token}`
      },
      body: JSON.stringify({ toolId }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`API toggleBookmark status ${res.status}`);
    const data = await res.json();

    revalidatePath(`/tools/${toolSlug}`);
    revalidatePath("/tools");

    return { bookmarked: data.bookmarked };
  } catch (error) {
    console.error("toggleBookmark action error:", error);
    return { bookmarked: false };
  }
}

const reviewSchema = z.object({
  toolId: z.string().min(1),
  toolSlug: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5, "Rating must be 1-5"),
  comment: z
    .string()
    .trim()
    .min(10, "Reviews need at least 10 characters")
    .max(1000, "Reviews must be under 1000 characters"),
});

export type ReviewFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const parsed = reviewSchema.safeParse({
    toolId: formData.get("toolId"),
    toolSlug: formData.get("toolSlug"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid review." };
  }

  const { toolId, toolSlug, rating, comment } = parsed.data;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value || '';
    const res = await fetch(`${API_URL}/api/v1/tools/${toolSlug}/reviews`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `auth_token=${token}`
      },
      body: JSON.stringify({ toolId, rating, comment }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`API submitReview status ${res.status}`);
    const data = await res.json();

    revalidatePath(`/tools/${toolSlug}`);

    return { status: "success", message: data.message || "Thanks — your review is live." };
  } catch (error: any) {
    console.error("submitReview action error:", error);
    return { status: "error", message: error.message || "Failed to submit review." };
  }
}
