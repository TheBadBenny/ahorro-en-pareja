"use client";

import { useFinancialData } from "@/lib/hooks/use-financial-data";
import {
  formatCurrency,
  getMonthName,
  getTotal,
  getGoalStatus,
  getStatusEmoji,
} from "@/lib/calculations";
import { DEFAULT_GOALS } from "@/types";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const NAMES: Record<string, string> = {
  "pedropalacioestrada@gmail.com": "Pedro",
  "aangelap19198@gmail.com": "Angela",
};

export default function HistoryPage() {
  const { history, isLoaded } = useFinancialData();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <h1 className="text-center text-lg font-semibold text-muted-foreground">
          Historico
        </h1>

        {history.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            Todavia no hay datos.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => {
              const total = getTotal(entry.contributions);
              const pct = Math.min(
                Math.round((total / DEFAULT_GOALS.target) * 100),
                100,
              );
              const status = getGoalStatus(total, 0);

              return (
                <Card key={`${entry.year}-${entry.month}`}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold capitalize">
                        {getMonthName(entry.month)} {entry.year}
                      </span>
                      <span className="text-sm">
                        {getStatusEmoji(status)} {formatCurrency(total)}
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {Object.entries(entry.contributions).map(
                        ([email, amount]) => (
                          <span key={email}>
                            {NAMES[email] ?? email.split("@")[0]}:{" "}
                            {formatCurrency(amount)}
                          </span>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
