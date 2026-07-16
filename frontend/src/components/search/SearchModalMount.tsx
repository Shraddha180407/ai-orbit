"use client";

import { SearchModal } from "@/components/search/SearchModal";
import { useSearchModal } from "@/context/SearchModalContext";

/** Bridges the Ctrl+K context to the actual modal UI — kept as its own
 *  client component so the surrounding layout can stay a server component. */
export function SearchModalMount() {
  const { isOpen, close } = useSearchModal();
  return <SearchModal open={isOpen} onClose={close} />;
}
