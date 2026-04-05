import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { MonthlyFinancialEntry } from "@/types";

const COLLECTION = "entries";

function entryDoc(month: number, year: number) {
  return doc(getFirebaseDb(), COLLECTION, `${year}-${month}`);
}

export async function getAllEntries(): Promise<MonthlyFinancialEntry[]> {
  const q = query(collection(getFirebaseDb(), COLLECTION), orderBy("year", "desc"), orderBy("month", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as MonthlyFinancialEntry);
}

export async function getEntry(
  month: number,
  year: number,
): Promise<MonthlyFinancialEntry | null> {
  const snap = await getDoc(entryDoc(month, year));
  return snap.exists() ? (snap.data() as MonthlyFinancialEntry) : null;
}

export async function saveEntry(entry: MonthlyFinancialEntry): Promise<void> {
  const ref = entryDoc(entry.month, entry.year);
  await setDoc(ref, { ...entry, updatedAt: new Date().toISOString() });
}

export async function deleteEntry(
  month: number,
  year: number,
): Promise<void> {
  await deleteDoc(entryDoc(month, year));
}
