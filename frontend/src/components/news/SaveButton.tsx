"use client";

import { useEffect, useState } from "react";
import Bookmark from "lucide-react/dist/esm/icons/bookmark";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  id: string;
  fluid?: boolean;
  initialBookmarked?: boolean;
}

export function SaveButton({ id, fluid, initialBookmarked }: SaveButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const key = "tas_bm_" + id;
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialBookmarked !== undefined) {
      setSaved(initialBookmarked);
      try {
        if (initialBookmarked) window.localStorage.setItem(key, "1");
        else window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
      return;
    }
    try {
      setSaved(window.localStorage.getItem(key) === "1");
    } catch {
      // ignore
    }
  }, [key, initialBookmarked]);

  const toggle = async () => {
    if (!user) {
      toast.error("Sign in required to bookmark articles", {
        description: "Please sign in or create an account to save stories.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/auth/signin"),
        },
        duration: 5000,
      });
      return;
    }

    if (pending) return;
    setPending(true);
    const next = !saved;
    try {
      const clientId = getClientId();
      const res = next
        ? await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/bookmark`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId }),
          })
        : await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/bookmark?clientId=${encodeURIComponent(clientId)}`, {
            method: "DELETE",
          });
      if (!res.ok) throw new Error(`bookmark failed: ${res.status}`);
      setSaved(next);
      try {
        if (next) window.localStorage.setItem(key, "1");
        else window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
      toast.success(next ? "Article saved to bookmarks" : "Article removed from bookmarks");
    } catch (err) {
      console.error("Bookmark failed:", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border h-10 px-4 text-sm font-medium transition-colors cursor-pointer",
        fluid ? "w-full justify-center" : "justify-start",
        saved ? "border-transparent text-black" : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#F5A623] hover:text-white",
        pending && "opacity-70 cursor-default"
      )}
      style={saved ? { backgroundColor: "var(--color-signal)" } : undefined}
    >
      <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
