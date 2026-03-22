"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestorer() {
  const pathname = usePathname();

  useEffect(() => {
    // Radix UI Dialog/AlertDialog adds overflow:hidden to body when open.
    // If you navigate away before closing the dialog, the style stays stuck.
    // This cleans it up on every route change.
    document.body.style.overflow = "";
    document.body.style.pointerEvents = "";
    document.body.removeAttribute("data-scroll-locked");

    // Also scroll to top on navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
