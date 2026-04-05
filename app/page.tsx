"use client";

import { useFinancialData } from "@/lib/hooks/use-financial-data";
import { analyzeGoals, getTotalPatrimony, formatCurrency } from "@/lib/calculations";
import { Header } from "@/components/layout/header";
import { StatusCard } from "@/components/dashboard/status-card";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { ExtrasCard } from "@/components/dashboard/extras-card";
import { GoalComparisonChart } from "@/components/charts/goal-comparison-chart";
import { RadialProgressChart } from "@/components/charts/radial-progress-chart";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { HistoryChart } from "@/components/charts/history-chart";
import { EntryForm } from "@/components/forms/entry-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function DashboardPage() {
  const { entries, currentEntry, isLoaded, save } = useFinancialData();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const entry = currentEntry ?? entries[0];

  if (!entry) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Bienvenidos</h1>
            <p className="mt-2 text-muted-foreground">
              Introduce los datos de vuestro primer mes para empezar.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <EntryForm onSave={save} />
          </div>
        </main>
      </>
    );
  }

  const analysis = analyzeGoals(entry);
  const patrimony = getTotalPatrimony(entry);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="edit">Editar mes</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Patrimony banner */}
            <Card className="border-dashed">
              <CardContent className="flex items-center gap-3 p-4">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-sm text-muted-foreground">
                    Patrimonio total estimado
                  </span>
                  <span className="ml-2 text-lg font-bold">
                    {formatCurrency(patrimony)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Main status + goals */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <StatusCard entry={entry} analysis={analysis} />
              </div>
              <GoalsCard
                totalSaved={entry.totalSaved}
                analysis={analysis}
                daysRemaining={entry.daysRemaining}
              />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <GoalComparisonChart totalSaved={entry.totalSaved} />
              <RadialProgressChart totalSaved={entry.totalSaved} />
            </div>

            {/* Portfolio + extras */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PortfolioChart entry={entry} />
              <ExtrasCard entry={entry} />
            </div>

            {/* History chart */}
            {entries.length >= 2 && <HistoryChart entries={entries} />}
          </TabsContent>

          <TabsContent value="edit">
            <div className="mx-auto max-w-2xl">
              <EntryForm existingEntry={entry} onSave={save} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
