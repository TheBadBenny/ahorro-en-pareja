"use client";

import { AuthProvider } from "@/lib/auth";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
