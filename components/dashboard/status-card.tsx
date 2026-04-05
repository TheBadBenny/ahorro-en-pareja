"use client";

import type { MonthlyFinancialEntry, GoalAnalysis } from "@/types";
import { DEFAULT_GOALS } from "@/types";
import {
  formatCurrency,
  getStatusLabel,
  getStatusBg,
  getMonthName,
} from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Calendar } from "lucide-react";

interface StatusCardProps {
  entry: MonthlyFinancialEntry;
  analysis: GoalAnalysis;
}

export function StatusCard({ entry, analysis }: StatusCardProps) {
  const isPositive = analysis.differenceFromTarget >= 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Ahorro del mes
            </p>
            <h2 className="mt-1 text-4xl font-bold tracking-tight">
              {formatCurrency(entry.totalSaved)}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={getStatusBg(analysis.status)}
              >
                {getStatusLabel(analysis.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {analysis.percentOfTarget}% del objetivo
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="capitalize">
                {getMonthName(entry.month)} {entry.year}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-end gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-semibold ${isPositive ? "text-emerald-500" : "text-red-500"}`}
              >
                {isPositive ? "+" : ""}
                {formatCurrency(analysis.differenceFromTarget)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              vs objetivo {formatCurrency(DEFAULT_GOALS.target)}
            </p>
          </div>
        </div>

        {/* Person breakdown */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Persona A
            </p>
            <p className="mt-0.5 text-xl font-semibold">
              {formatCurrency(entry.personASaved)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Persona B
            </p>
            <p className="mt-0.5 text-xl font-semibold">
              {formatCurrency(entry.personBSaved)}
            </p>
          </div>
        </div>

        {/* Daily savings needed */}
        {entry.daysRemaining > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-dashed p-3">
            <Target className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">
              <span className="text-muted-foreground">Necesitas </span>
              <span className="font-semibold">
                {formatCurrency(analysis.dailyForTarget)}/dia
              </span>
              <span className="text-muted-foreground">
                {" "}
                durante {entry.daysRemaining} dias para llegar al objetivo
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
