"use client";

import { useState, useEffect, useCallback } from "react";
import type { MonthEntry } from "@/types";
import {
  getMonthEntry,
  saveContribution,
  getAllEntries,
} from "@/lib/storage/firestore";

export function useFinancialData() {
  const [currentEntry, setCurrentEntry] = useState<MonthEntry | null>(null);
  const [history, setHistory] = useState<MonthEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const refresh = useCallback(async () => {
    const [entry, all] = await Promise.all([
      getMonthEntry(month, year),
      getAllEntries(),
    ]);
    setCurrentEntry(entry);
    setHistory(all);
  }, [month, year]);

  useEffect(() => {
    refresh()
      .catch((err) => console.error("Failed to load:", err))
      .finally(() => setIsLoaded(true));
  }, [refresh]);

  const save = useCallback(
    async (email: string, amount: number) => {
      await saveContribution(month, year, email, amount);
      await refresh();
    },
    [month, year, refresh],
  );

  return { currentEntry, history, isLoaded, save, month, year };
}
