"use client";

import type { GoalAnalysis } from "@/types";
import { DEFAULT_GOALS } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Target } from "lucide-react";

interface GoalsCardProps {
  totalSaved: number;
  analysis: GoalAnalysis;
  daysRemaining: number;
}

const goals = [
  {
    label: "Minimo",
    amount: DEFAULT_GOALS.minimum,
    key: "minimum" as const,
  },
  {
    label: "Recomendado",
    amount: DEFAULT_GOALS.target,
    key: "target" as const,
  },
  {
    label: "Comodo",
    amount: DEFAULT_GOALS.comfortable,
    key: "comfortable" as const,
  },
];

export function GoalsCard({
  totalSaved,
  analysis,
  daysRemaining,
}: GoalsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4" />
          Objetivos mensuales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const percent = Math.min(
            Math.round((totalSaved / goal.amount) * 100),
            100,
          );
          const reached = totalSaved >= goal.amount;
          const remaining = Math.max(goal.amount - totalSaved, 0);
          const daily =
            daysRemaining > 0 ? Math.ceil(remaining / daysRemaining) : 0;

          return (
            <div key={goal.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {reached ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{goal.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(goal.amount)}
                  </span>
                </div>
                <span className="text-sm font-semibold">{percent}%</span>
              </div>
              <Progress value={percent} className="h-2" />
              {!reached && daysRemaining > 0 && (
                <p className="text-xs text-muted-foreground">
                  Faltan {formatCurrency(remaining)} &middot;{" "}
                  {formatCurrency(daily)}/dia
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
