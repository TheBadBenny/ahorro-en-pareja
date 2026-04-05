import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { MonthEntry } from "@/types";

const COLLECTION = "entries";

function monthId(month: number, year: number) {
  return `${year}-${month}`;
}

export async function getMonthEntry(month: number, year: number): Promise<MonthEntry | null> {
  const snap = await getDoc(doc(getFirebaseDb(), COLLECTION, monthId(month, year)));
  return snap.exists() ? (snap.data() as MonthEntry) : null;
}

export async function saveContribution(
  month: number,
  year: number,
  email: string,
  amount: number,
): Promise<void> {
  const id = monthId(month, year);
  const ref = doc(getFirebaseDb(), COLLECTION, id);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    const data = existing.data() as MonthEntry;
    await setDoc(ref, {
      ...data,
      contributions: { ...data.contributions, [email]: amount },
    });
  } else {
    await setDoc(ref, {
      month,
      year,
      contributions: { [email]: amount },
    });
  }
}

export async function getAllEntries(): Promise<MonthEntry[]> {
  const snap = await getDocs(collection(getFirebaseDb(), COLLECTION));
  const entries = snap.docs.map((d) => d.data() as MonthEntry);
  return entries.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}
