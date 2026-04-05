import { DEFAULT_GOALS, ANNUAL_GOAL, type GoalStatus, type SavingsGoals } from "@/types";

export function getGoalStatus(total: number, daysRemaining: number): GoalStatus {
  const goals = DEFAULT_GOALS;
  if (total >= goals.comfortable) return "above";

  const now = new Date();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const elapsed = totalDays - daysRemaining;
  const progressRatio = elapsed / totalDays;
  const expected = goals.target * progressRatio;

  if (total >= expected * 0.95) return "on-track";
  if (total >= expected * 0.75) return "slightly-below";
  return "below";
}

export function getStatusLabel(status: GoalStatus): string {
  const map: Record<GoalStatus, string> = {
    above: "Por encima",
    "on-track": "En linea",
    "slightly-below": "Ligeramente por debajo",
    below: "Por debajo",
  };
  return map[status];
}

export function getStatusEmoji(status: GoalStatus): string {
  const map: Record<GoalStatus, string> = {
    above: "🟢",
    "on-track": "🟢",
    "slightly-below": "🟡",
    below: "🔴",
  };
  return map[status];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMonthName(month: number): string {
  return new Date(2024, month - 1).toLocaleDateString("es-ES", { month: "long" });
}

export function getDaysRemainingInMonth(): number {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

export function getTotal(contributions: Record<string, number>): number {
  return Object.values(contributions).reduce((sum, v) => sum + v, 0);
}

export function getYearlyTotal(
  history: { month: number; year: number; contributions: Record<string, number> }[],
  year: number,
): number {
  return history
    .filter((e) => e.year === year)
    .reduce((sum, e) => sum + getTotal(e.contributions), 0);
}

export function getYearlyCumulative(
  history: { month: number; year: number; contributions: Record<string, number> }[],
  year: number,
): { month: string; monthNum: number; cumulative: number | null; ideal: number; monthly: number }[] {
  const now = new Date();
  const currentMonth = now.getFullYear() === year ? now.getMonth() + 1 : 12;
  const perMonth = ANNUAL_GOAL / 12;

  // Build a map of month -> total for this year
  const monthMap = new Map<number, number>();
  for (const e of history) {
    if (e.year === year) {
      monthMap.set(e.month, getTotal(e.contributions));
    }
  }

  let cumulative = 0;
  const result: { month: string; monthNum: number; cumulative: number | null; ideal: number; monthly: number }[] = [];

  for (let m = 1; m <= 12; m++) {
    const monthly = monthMap.get(m) ?? 0;
    const hasPassed = m <= currentMonth;

    if (hasPassed) {
      cumulative += monthly;
    }

    result.push({
      month: getMonthName(m).slice(0, 3),
      monthNum: m,
      cumulative: hasPassed ? cumulative : null,
      ideal: Math.round(perMonth * m),
      monthly,
    });
  }

  return result;
}
