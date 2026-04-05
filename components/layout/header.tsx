"use client";

import { Moon, Sun, PiggyBank, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/hooks/use-theme";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-lg font-bold tracking-tight sm:block">
            Ahorro en Pareja
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" render={<Link href="/" />}>
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/history" />}>
            Historico
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {user && (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-7 w-7 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                aria-label="Cerrar sesion"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
