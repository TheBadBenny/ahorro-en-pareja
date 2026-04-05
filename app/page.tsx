"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useFinancialData } from "@/lib/hooks/use-financial-data";
import {
  formatCurrency,
  getMonthName,
  getDaysRemainingInMonth,
  getGoalStatus,
  getStatusLabel,
  getTotal,
} from "@/lib/calculations";
import { DEFAULT_GOALS } from "@/types";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, TrendingDown, CalendarDays } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const NAMES: Record<string, string> = {
  "pedropalacioestrada@gmail.com": "Pedro",
  "aangelap19198@gmail.com": "Angela",
};

function getName(email: string): string {
  return NAMES[email] ?? email.split("@")[0];
}

const statusConfig = {
  above: { color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", chart: "hsl(155, 70%, 45%)" },
  "on-track": { color: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", chart: "hsl(155, 70%, 45%)" },
  "slightly-below": { color: "text-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/20", chart: "hsl(38, 92%, 50%)" },
  below: { color: "text-red-500", bg: "bg-red-500/10", ring: "ring-red-500/20", chart: "hsl(0, 72%, 51%)" },
};

export default function Home() {
  const { user } = useAuth();
  const { currentEntry, isLoaded, save, month, year } = useFinancialData();
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const email = user?.email ?? "";
  const contributions = currentEntry?.contributions ?? {};
  const myAmount = contributions[email] ?? 0;
  const total = getTotal(contributions);
  const daysLeft = getDaysRemainingInMonth();
  const status = getGoalStatus(total, daysLeft);
  const sc = statusConfig[status];
  const pctTarget = Math.min(Math.round((total / DEFAULT_GOALS.target) * 100), 100);
  const diff = total - DEFAULT_GOALS.target;

  const chartData = [{ value: pctTarget, fill: sc.chart }];

  async function handleSave() {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) return;
    setSaving(true);
    await save(email, value);
    setSaving(false);
    setSaved(true);
    setAmount("");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-10 pt-4 space-y-4">
        {/* Month badge */}
        <div className="flex items-center justify-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium capitalize text-muted-foreground tracking-wide">
            {getMonthName(month)} {year}
          </span>
        </div>

        {/* Hero: Radial chart + total */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative flex flex-col items-center px-6 pt-6 pb-5">
              {/* Subtle gradient bg */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.04] to-transparent" />

              <div className="relative h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="78%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                    data={chartData}
                    barSize={12}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={12}
                      background={{ fill: "hsl(var(--muted))" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight">
                    {pctTarget}%
                  </span>
                  <span className="text-xs text-muted-foreground">del objetivo</span>
                </div>
              </div>

              <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
                {formatCurrency(total)}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${sc.bg} ${sc.color} ${sc.ring}`}>
                  {getStatusLabel(status)}
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${diff >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {diff >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {diff >= 0 ? "+" : ""}{formatCurrency(diff)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Person cards */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(NAMES).map(([personEmail, name]) => {
            const isMe = personEmail === email;
            const personAmount = contributions[personEmail] ?? 0;
            return (
              <Card key={personEmail} className={isMe ? "ring-2 ring-primary/25" : ""}>
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">{name}</p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                    {formatCurrency(personAmount)}
                  </p>
                  {isMe && (
                    <p className="mt-0.5 text-[10px] font-medium text-primary">Tu</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Goals */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Objetivos
            </p>
            {[
              { label: "Minimo", goal: DEFAULT_GOALS.minimum, color: "bg-amber-400" },
              { label: "Recomendado", goal: DEFAULT_GOALS.target, color: "bg-primary" },
              { label: "Comodo", goal: DEFAULT_GOALS.comfortable, color: "bg-emerald-500" },
            ].map(({ label, goal, color }) => {
              const pct = Math.min(Math.round((total / goal) * 100), 100);
              const remaining = Math.max(goal - total, 0);
              const reached = total >= goal;
              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {label}
                      <span className="ml-1.5 text-muted-foreground font-normal">
                        {formatCurrency(goal)}
                      </span>
                    </span>
                    <span className={`font-semibold tabular-nums ${reached ? "text-emerald-500" : ""}`}>
                      {reached ? "✓" : `${pct}%`}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {!reached && daysLeft > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Faltan {formatCurrency(remaining)} &middot;{" "}
                      {formatCurrency(Math.ceil(remaining / daysLeft))}/dia
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Input */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm font-semibold">
              Tu ahorro, {getName(email)}
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  €
                </span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder={myAmount > 0 ? String(myAmount) : "0"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 text-lg font-semibold h-11"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
              </div>
              <Button onClick={handleSave} disabled={saving || !amount} className="h-11 px-5">
                {saved ? <Check className="h-4 w-4" /> : saving ? "..." : "Guardar"}
              </Button>
            </div>
            {myAmount > 0 && !amount && (
              <p className="text-xs text-muted-foreground">
                Guardado: {formatCurrency(myAmount)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer info */}
        {daysLeft > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            {daysLeft} dias restantes en el mes
          </p>
        )}
      </main>
    </>
  );
}
