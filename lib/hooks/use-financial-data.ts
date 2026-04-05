"use client";

import { useState, useEffect, useCallback } from "react";
import type { MonthlyFinancialEntry } from "@/types";
import {
  getAllEntries,
  saveEntry,
  deleteEntry,
  getEntriesSorted,
  getCurrentMonthEntry,
} from "@/lib/storage";
import { seedData } from "@/data/seed";

export function useFinancialData() {
  const [entries, setEntries] = useState<MonthlyFinancialEntry[]>([]);
  const [currentEntry, setCurrentEntry] =
    useState<MonthlyFinancialEntry | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    const sorted = getEntriesSorted();
    setEntries(sorted);

    const current = getCurrentMonthEntry();
    setCurrentEntry(current);
  }, []);

  // Load data on mount, seed if empty
  useEffect(() => {
    const existing = getAllEntries();
    if (Object.keys(existing).length === 0) {
      seedData.forEach((entry) => saveEntry(entry));
    }
    refresh();
    setIsLoaded(true);
  }, [refresh]);

  const save = useCallback(
    (entry: MonthlyFinancialEntry) => {
      saveEntry(entry);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (month: number, year: number) => {
      deleteEntry(month, year);
      refresh();
    },
    [refresh],
  );

  return { entries, currentEntry, isLoaded, save, remove, refresh };
}
