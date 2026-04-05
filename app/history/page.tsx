"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useFinancialData } from "@/lib/hooks/use-financial-data";
import {
  formatCurrency,
  getMonthName,
  getTotal,
  getGoalStatus,
  getStatusLabel,
} from "@/lib/calculations";
import { DEFAULT_GOALS, type MonthEntry } from "@/types";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const NAMES: Record<string, string> = {
  "pedropalacioestrada@gmail.com": "Pedro",
  "aangelap19198@gmail.com": "Angela",
};

const statusColors: Record<string, string> = {
  above: "text-emerald-500 bg-emerald-500/10",
  "on-track": "text-emerald-500 bg-emerald-500/10",
  "slightly-below": "text-amber-500 bg-amber-500/10",
  below: "text-red-500 bg-red-500/10",
};

const barColors: Record<string, string> = {
  above: "hsl(155, 70%, 45%)",
  "on-track": "hsl(155, 70%, 45%)",
  "slightly-below": "hsl(38, 92%, 50%)",
  below: "hsl(0, 72%, 51%)",
};

function MonthDetail({
  entry,
  email,
  onSave,
}: {
  entry: MonthEntry;
  email: string;
  onSave: (amount: number, month: number, year: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const total = getTotal(entry.contributions);
  const pctTarget = Math.min(Math.round((total / DEFAULT_GOALS.target) * 100), 100);
  const status = getGoalStatus(total, 0);
  const chartFill = barColors[status];
  const myAmount = entry.contributions[email] ?? 0;

  async function handleSave() {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) return;
    setSaving(true);
    await onSave(value, entry.month, entry.year);
    setSaving(false);
    setSaved(true);
    setAmount("");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mt-3 space-y-4 border-t pt-4">
      {/* Radial + total */}
      <div className="flex items-center gap-4">
        <div className="relative h-[100px] w-[100px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              data={[{ value: pctTarget, fill: chartFill }]}
              barSize={10}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(var(--muted))" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-[family-name:var(--font-display)] text-lg font-extrabold">
              {pctTarget}%
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
            {formatCurrency(total)}
          </p>
          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[status]}`}>
            {getStatusLabel(status)}
          </span>
        </div>
      </div>

      {/* Per-person */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(NAMES).map(([personEmail, name]) => (
          <div key={personEmail} className={`rounded-lg p-3 text-center ${personEmail === email ? "bg-primary/10 ring-1 ring-primary/20" : "bg-muted/50"}`}>
            <p className="text-xs text-muted-foreground">{name}</p>
            <p className="mt-0.5 font-[family-name:var(--font-display)] text-lg font-bold">
              {formatCurrency(entry.contributions[personEmail] ?? 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Edit input */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">
          Editar tu ahorro de <span className="capitalize">{getMonthName(entry.month)}</span>
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder={myAmount > 0 ? String(myAmount) : "0"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7 text-base font-semibold h-10"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <Button onClick={handleSave} disabled={saving || !amount} size="sm" className="h-10 px-4">
            {saved ? <Check className="h-4 w-4" /> : saving ? "..." : "Guardar"}
          </Button>
        </div>
      </div>

      {/* Goals breakdown */}
      <div className="space-y-2">
        {[
          { label: "Minimo", goal: DEFAULT_GOALS.minimum, color: "bg-amber-400" },
          { label: "Recomendado", goal: DEFAULT_GOALS.target, color: "bg-primary" },
          { label: "Comodo", goal: DEFAULT_GOALS.comfortable, color: "bg-emerald-500" },
        ].map(({ label, goal, color }) => {
          const pct = Math.min(Math.round((total / goal) * 100), 100);
          const reached = total >= goal;
          return (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>
                  {label} <span className="text-muted-foreground">{formatCurrency(goal)}</span>
                </span>
                <span className="font-semibold">{reached ? "✓" : `${pct}%`}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const { history, isLoaded, save } = useFinancialData();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addingMonth, setAddingMonth] = useState(false);
  const [newMonthAmount, setNewMonthAmount] = useState("");
  const [selectedPastMonth, setSelectedPastMonth] = useState("");
  const [addingSaving, setAddingSaving] = useState(false);

  // All hooks must be above the early return
  const missingMonths = useMemo(() => {
    const now = new Date();
    const existingKeys = new Set(history.map((e) => `${e.year}-${e.month}`));
    const missing: { month: number; year: number; label: string }[] = [];
    for (let i = 1; i <= 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      if (!existingKeys.has(`${y}-${m}`)) {
        missing.push({ month: m, year: y, label: `${getMonthName(m)} ${y}` });
      }
    }
    return missing;
  }, [history]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const email = user?.email ?? "";

  const chartData = [...history]
    .reverse()
    .map((entry) => {
      const total = getTotal(entry.contributions);
      const status = getGoalStatus(total, 0);
      return {
        name: getMonthName(entry.month).slice(0, 3),
        total,
        status,
      };
    });

  function toggleExpand(key: string) {
    setExpanded((prev) => (prev === key ? null : key));
  }

  async function handleSave(amount: number, month: number, year: number) {
    await save(email, amount, month, year);
  }

  async function handleAddPastMonth() {
    if (!selectedPastMonth || !newMonthAmount) return;
    const [y, m] = selectedPastMonth.split("-").map(Number);
    const value = parseFloat(newMonthAmount);
    if (isNaN(value) || value < 0) return;
    setAddingSaving(true);
    await save(email, value, m, y);
    setAddingSaving(false);
    setNewMonthAmount("");
    setSelectedPastMonth("");
    setAddingMonth(false);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-10 pt-4 space-y-4">
        <h1 className="text-center font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Historico
        </h1>

        {history.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-10">
            Todavia no hay datos.
          </p>
        ) : (
          <>
            {/* Evolution chart */}
            {chartData.length >= 2 && (
              <Card>
                <CardContent className="p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Evolucion
                  </p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                        <Tooltip
                          formatter={(value) => [formatCurrency(Number(value)), "Total"]}
                          contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid hsl(var(--border))",
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--card-foreground))",
                            fontSize: "13px",
                          }}
                        />
                        <ReferenceLine y={DEFAULT_GOALS.target} stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeOpacity={0.5} />
                        <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={36}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={barColors[entry.status]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Month list */}
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Meses
            </p>
            <div className="space-y-2.5">
              {history.map((entry) => {
                const key = `${entry.year}-${entry.month}`;
                const total = getTotal(entry.contributions);
                const pct = Math.min(Math.round((total / DEFAULT_GOALS.target) * 100), 100);
                const status = getGoalStatus(total, 0);
                const isOpen = expanded === key;

                return (
                  <Card key={key} className="overflow-hidden">
                    <CardContent className="p-4">
                      <button
                        onClick={() => toggleExpand(key)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-[family-name:var(--font-display)] text-sm font-bold text-primary">
                            {String(entry.month).padStart(2, "0")}
                          </div>
                          <div>
                            <p className="font-[family-name:var(--font-display)] font-bold capitalize">
                              {getMonthName(entry.month)} {entry.year}
                            </p>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              {Object.entries(entry.contributions).map(([personEmail, amt]) => (
                                <span key={personEmail}>
                                  {NAMES[personEmail] ?? personEmail.split("@")[0]}: {formatCurrency(amt)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-[family-name:var(--font-display)] text-lg font-bold tabular-nums">
                              {formatCurrency(total)}
                            </p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[status]}`}>
                              {pct}%
                            </span>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Progress bar */}
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Expanded detail with edit */}
                      {isOpen && (
                        <MonthDetail entry={entry} email={email} onSave={handleSave} />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Add past month */}
            {missingMonths.length > 0 && (
              <div>
                {!addingMonth ? (
                  <button
                    onClick={() => setAddingMonth(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border p-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Plus className="h-4 w-4" />
                    Anadir mes anterior
                  </button>
                ) : (
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Anadir ahorro de un mes anterior
                      </p>
                      <select
                        value={selectedPastMonth}
                        onChange={(e) => setSelectedPastMonth(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm capitalize"
                      >
                        <option value="">Selecciona mes...</option>
                        {missingMonths.map((m) => (
                          <option key={`${m.year}-${m.month}`} value={`${m.year}-${m.month}`} className="capitalize">
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="any"
                            placeholder="0"
                            value={newMonthAmount}
                            onChange={(e) => setNewMonthAmount(e.target.value)}
                            className="pl-7 text-base font-semibold h-10"
                            onKeyDown={(e) => e.key === "Enter" && handleAddPastMonth()}
                          />
                        </div>
                        <Button
                          onClick={handleAddPastMonth}
                          disabled={addingSaving || !selectedPastMonth || !newMonthAmount}
                          size="sm"
                          className="h-10 px-4"
                        >
                          {addingSaving ? "..." : "Guardar"}
                        </Button>
                      </div>
                      <button
                        onClick={() => setAddingMonth(false)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancelar
                      </button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
