"use client";

import { useFinancialData } from "@/lib/hooks/use-financial-data";
import {
  analyzeGoals,
  formatCurrency,
  getMonthName,
  getStatusLabel,
  getStatusBg,
} from "@/lib/calculations";
import { Header } from "@/components/layout/header";
import { HistoryChart } from "@/components/charts/history-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { entries, isLoaded, remove } = useFinancialData();

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
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Historico mensual
          </h1>
          <p className="mt-1 text-muted-foreground">
            Revisa el progreso de todos los meses registrados.
          </p>
        </div>

        {entries.length >= 2 && (
          <div className="mb-8">
            <HistoryChart entries={entries} />
          </div>
        )}

        {entries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-10">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                No hay datos registrados todavia.
              </p>
              <Button render={<Link href="/" />}>
                Ir al dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const analysis = analyzeGoals(entry);
              return (
                <Card
                  key={entry.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                        {String(entry.month).padStart(2, "0")}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">
                          {getMonthName(entry.month)} {entry.year}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Total: {formatCurrency(entry.totalSaved)}
                          {entry.notes && ` — ${entry.notes}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={getStatusBg(analysis.status)}
                      >
                        {getStatusLabel(analysis.status)}
                      </Badge>
                      <span className="text-sm font-semibold tabular-nums">
                        {analysis.percentOfTarget}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          if (
                            confirm(
                              `Eliminar ${getMonthName(entry.month)} ${entry.year}?`,
                            )
                          ) {
                            remove(entry.month, entry.year);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
