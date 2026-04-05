"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const allowedEmails = [
  "pedropalacioestrada@gmail.com",
  "aangelap19198@gmail.com",
];

function isEmailAllowed(email: string | null): boolean {
  if (!email) return false;
  if (allowedEmails.length === 0) return true; // no whitelist = allow all
  return allowedEmails.includes(email.toLowerCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (firebaseUser) => {
      if (firebaseUser && !isEmailAllowed(firebaseUser.email)) {
        await firebaseSignOut(getFirebaseAuth());
        setUser(null);
        setError("Este email no tiene acceso a la aplicacion.");
      } else {
        setUser(firebaseUser);
        setError(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    setError(null);
    try {
      const result = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
      if (!isEmailAllowed(result.user.email)) {
        await firebaseSignOut(getFirebaseAuth());
        setUser(null);
        setError("Este email no tiene acceso a la aplicacion.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al iniciar sesion";
      setError(message);
    }
  }

  async function signOut() {
    await firebaseSignOut(getFirebaseAuth());
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
