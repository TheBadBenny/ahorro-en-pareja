import type { DataProvider } from "@/types";

// ──────────────────────────────────────────────
// Manual Data Provider (currently active)
// ──────────────────────────────────────────────
export const manualDataProvider: DataProvider = {
  id: "manual",
  name: "Entrada Manual",
  description: "Introduce las cifras manualmente cada mes.",
  isAvailable: true,
};

// ──────────────────────────────────────────────
// Revolut Provider (stub for future integration)
// ──────────────────────────────────────────────
export const revolutProvider: DataProvider = {
  id: "revolut",
  name: "Revolut",
  description: "Importa datos automáticamente desde Revolut.",
  isAvailable: false,
  async fetchBalance() {
    throw new Error("Revolut integration not yet implemented");
  },
  async fetchTransactions() {
    throw new Error("Revolut integration not yet implemented");
  },
};

// ──────────────────────────────────────────────
// Bank Aggregator Provider (stub for GoCardless / Nordigen)
// ──────────────────────────────────────────────
export const bankAggregatorProvider: DataProvider = {
  id: "bank-aggregator",
  name: "Agregador Bancario",
  description:
    "Conecta con múltiples bancos a través de GoCardless / Nordigen.",
  isAvailable: false,
  async fetchBalance() {
    throw new Error("Bank aggregator integration not yet implemented");
  },
  async fetchTransactions() {
    throw new Error("Bank aggregator integration not yet implemented");
  },
};

// Registry of all providers
export const providers: DataProvider[] = [
  manualDataProvider,
  revolutProvider,
  bankAggregatorProvider,
];

export function getProvider(id: string): DataProvider | undefined {
  return providers.find((p) => p.id === id);
}

export function getActiveProviders(): DataProvider[] {
  return providers.filter((p) => p.isAvailable);
}
