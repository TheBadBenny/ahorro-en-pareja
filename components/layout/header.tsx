"use client";

import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/hooks/use-theme";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="culete">🐷</span>
          <span className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight">
            Culete
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" render={<Link href="/" />}>
            Hoy
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/history" />}>
            Meses
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Tema">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user && (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-6 w-6 rounded-full ring-1 ring-border"
                  referrerPolicy="no-referrer"
                />
              )}
              <Button variant="ghost" size="icon" onClick={signOut} aria-label="Salir">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
