"use client";

import { useState, useEffect, useCallback } from "react";
import type { MonthlyFinancialEntry } from "@/types";
import {
  getAllEntries,
  saveEntry,
  deleteEntry,
} from "@/lib/storage/firestore";

export function useFinancialData() {
  const [entries, setEntries] = useState<MonthlyFinancialEntry[]>([]);
  const [currentEntry, setCurrentEntry] =
    useState<MonthlyFinancialEntry | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const sorted = await getAllEntries();
    setEntries(sorted);

    const now = new Date();
    const current =
      sorted.find(
        (e) => e.month === now.getMonth() + 1 && e.year === now.getFullYear(),
      ) ?? null;
    setCurrentEntry(current);
  }, []);

  useEffect(() => {
    refresh()
      .catch((err) => console.error("Failed to load entries:", err))
      .finally(() => setIsLoaded(true));
  }, [refresh]);

  const save = useCallback(
    async (entry: MonthlyFinancialEntry) => {
      await saveEntry(entry);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (month: number, year: number) => {
      await deleteEntry(month, year);
      await refresh();
    },
    [refresh],
  );

  return { entries, currentEntry, isLoaded, save, remove, refresh };
}
