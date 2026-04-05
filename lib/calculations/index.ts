import {
  type MonthlyFinancialEntry,
  type SavingsGoals,
  type GoalAnalysis,
  type GoalStatus,
  type PortfolioBreakdown,
  DEFAULT_GOALS,
} from "@/types";

export function analyzeGoals(
  entry: MonthlyFinancialEntry,
  goals: SavingsGoals = DEFAULT_GOALS,
): GoalAnalysis {
  const { totalSaved, daysRemaining } = entry;
  const days = Math.max(daysRemaining, 1);

  const remainingMinimum = Math.max(goals.minimum - totalSaved, 0);
  const remainingTarget = Math.max(goals.target - totalSaved, 0);
  const remainingComfortable = Math.max(goals.comfortable - totalSaved, 0);

  const percentOfTarget = Math.round((totalSaved / goals.target) * 100);
  const differenceFromTarget = totalSaved - goals.target;

  return {
    status: getGoalStatus(totalSaved, goals, daysRemaining),
    remainingMinimum,
    remainingTarget,
    remainingComfortable,
    dailyForMinimum: Math.ceil(remainingMinimum / days),
    dailyForTarget: Math.ceil(remainingTarget / days),
    dailyForComfortable: Math.ceil(remainingComfortable / days),
    percentOfTarget,
    differenceFromTarget,
  };
}

function getGoalStatus(
  totalSaved: number,
  goals: SavingsGoals,
  daysRemaining: number,
): GoalStatus {
  // Already above comfortable
  if (totalSaved >= goals.comfortable) return "above";

  // Calculate expected progress based on days elapsed
  const totalDaysInMonth = daysRemaining + getDaysElapsed();
  const progressRatio = (totalDaysInMonth - daysRemaining) / totalDaysInMonth;
  const expectedAtThisPoint = goals.target * progressRatio;

  if (totalSaved >= expectedAtThisPoint * 0.95) return "on-track";
  if (totalSaved >= expectedAtThisPoint * 0.75) return "slightly-below";
  return "below";
}

function getDaysElapsed(): number {
  const now = new Date();
  return now.getDate();
}

export function getStatusColor(status: GoalStatus): string {
  switch (status) {
    case "above":
      return "text-emerald-500";
    case "on-track":
      return "text-emerald-500";
    case "slightly-below":
      return "text-amber-500";
    case "below":
      return "text-red-500";
  }
}

export function getStatusBg(status: GoalStatus): string {
  switch (status) {
    case "above":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "on-track":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "slightly-below":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "below":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
  }
}

export function getStatusLabel(status: GoalStatus): string {
  switch (status) {
    case "above":
      return "Por encima";
    case "on-track":
      return "En linea";
    case "slightly-below":
      return "Ligeramente por debajo";
    case "below":
      return "Por debajo";
  }
}

export function getPortfolioBreakdown(
  entry: MonthlyFinancialEntry,
): PortfolioBreakdown[] {
  return [
    { label: "Fondo Boda", value: entry.weddingFund, color: "hsl(280, 70%, 60%)" },
    { label: "Fondo Vivienda", value: entry.housingFund, color: "hsl(210, 70%, 55%)" },
    { label: "Colchon", value: entry.emergencyFund, color: "hsl(150, 60%, 45%)" },
    { label: "Indices", value: entry.indexPortfolio, color: "hsl(35, 90%, 55%)" },
    { label: "Cripto", value: entry.crypto, color: "hsl(45, 95%, 55%)" },
  ].filter((item) => item.value > 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getMonthName(month: number): string {
  const date = new Date(2024, month - 1);
  return date.toLocaleDateString("es-ES", { month: "long" });
}

export function getDaysRemainingInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

export function getTotalPatrimony(entry: MonthlyFinancialEntry): number {
  return (
    entry.totalLiquidity +
    entry.indexPortfolio +
    entry.crypto +
    entry.weddingFund +
    entry.housingFund +
    entry.emergencyFund
  );
}
