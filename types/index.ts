export interface MonthEntry {
  month: number;
  year: number;
  contributions: Record<string, number>; // email -> amount
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
