"use client";

import { AuthProvider } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const base = document.querySelector("meta[name='next-base-path']")?.getAttribute("content") ?? "";
      navigator.serviceWorker.register(`${base}/sw.js`).catch(() => {});
    }
  }, []);

  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
