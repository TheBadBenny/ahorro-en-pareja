import type { MonthlyFinancialEntry, MonthKey } from "@/types";

const STORAGE_KEY = "ahorro-en-pareja-data";

export function getAllEntries(): Record<MonthKey, MonthlyFinancialEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getEntry(
  month: number,
  year: number,
): MonthlyFinancialEntry | null {
  const entries = getAllEntries();
  return entries[`${year}-${month}`] ?? null;
}

export function getCurrentMonthEntry(): MonthlyFinancialEntry | null {
  const now = new Date();
  return getEntry(now.getMonth() + 1, now.getFullYear());
}

export function saveEntry(entry: MonthlyFinancialEntry): void {
  const entries = getAllEntries();
  const key: MonthKey = `${entry.year}-${entry.month}`;
  entries[key] = { ...entry, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteEntry(month: number, year: number): void {
  const entries = getAllEntries();
  const key: MonthKey = `${year}-${month}`;
  delete entries[key];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntriesSorted(): MonthlyFinancialEntry[] {
  const entries = getAllEntries();
  return Object.values(entries).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

export function hasAnyData(): boolean {
  return Object.keys(getAllEntries()).length > 0;
}
