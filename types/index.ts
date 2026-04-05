// ──────────────────────────────────────────────
// Core domain types for the financial tracker
// ──────────────────────────────────────────────

export interface MonthlyFinancialEntry {
  id: string;
  month: number; // 1-12
  year: number;
  personASaved: number;
  personBSaved: number;
  totalSaved: number;
  currentDate: string; // ISO date string
  daysRemaining: number;
  extraordinaryPaid: number;
  extraordinaryPlanned: number;
  weddingFund: number;
  housingFund: number;
  emergencyFund: number;
  totalLiquidity: number;
  indexPortfolio: number;
  crypto: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoals {
  minimum: number;
  target: number;
  comfortable: number;
}

export const DEFAULT_GOALS: SavingsGoals = {
  minimum: 3500,
  target: 3800,
  comfortable: 4000,
};

export type GoalStatus = "above" | "on-track" | "slightly-below" | "below";

export interface GoalAnalysis {
  status: GoalStatus;
  remainingMinimum: number;
  remainingTarget: number;
  remainingComfortable: number;
  dailyForMinimum: number;
  dailyForTarget: number;
  dailyForComfortable: number;
  percentOfTarget: number;
  differenceFromTarget: number;
}

export interface PortfolioBreakdown {
  label: string;
  value: number;
  color: string;
}

// ──────────────────────────────────────────────
// Data Provider abstraction (future-proof)
// ──────────────────────────────────────────────

export interface DataProvider {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  fetchBalance?: () => Promise<number>;
  fetchTransactions?: () => Promise<Transaction[]>;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  source: string;
}

export type MonthKey = `${number}-${number}`; // "2026-4"
