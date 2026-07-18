'use client';

import React, { useEffect, useState } from "react";
import ChevronsUp from "lucide-react/dist/esm/icons/chevrons-up";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full border border-[#232326] bg-[#18181C]/90 text-[#A1A1AA] hover:text-white hover:border-neutral-500 hover:bg-[#18181C] shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6E56CF] cursor-pointer"
      aria-label="Scroll to top"
    >
      <ChevronsUp size={16} />
    </button>
  );
}
