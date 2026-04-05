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
  getStatusEmoji,
  getTotal,
} from "@/lib/calculations";
import { DEFAULT_GOALS } from "@/types";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

const NAMES: Record<string, string> = {
  "pedropalacioestrada@gmail.com": "Pedro",
  "aangelap19198@gmail.com": "Angela",
};

function getName(email: string): string {
  return NAMES[email] ?? email.split("@")[0];
}

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
  const pctTarget = Math.min(Math.round((total / DEFAULT_GOALS.target) * 100), 100);
  const pctComfortable = Math.min(Math.round((total / DEFAULT_GOALS.comfortable) * 100), 100);

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
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Month title */}
        <h1 className="text-center text-lg font-semibold capitalize text-muted-foreground">
          {getMonthName(month)} {year}
        </h1>

        {/* Total */}
        <Card>
          <CardContent className="p-5 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Ahorro del mes</p>
            <p className="text-4xl font-bold tracking-tight">
              {formatCurrency(total)}
            </p>
            <p className="text-sm">
              {getStatusEmoji(status)} {getStatusLabel(status)}
            </p>
          </CardContent>
        </Card>

        {/* Progress bars */}
        <Card>
          <CardContent className="p-5 space-y-4">
            {[
              { label: "Minimo", goal: DEFAULT_GOALS.minimum },
              { label: "Recomendado", goal: DEFAULT_GOALS.target },
              { label: "Comodo", goal: DEFAULT_GOALS.comfortable },
            ].map(({ label, goal }) => {
              const pct = Math.min(Math.round((total / goal) * 100), 100);
              const remaining = Math.max(goal - total, 0);
              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>
                      {label}{" "}
                      <span className="text-muted-foreground">
                        {formatCurrency(goal)}
                      </span>
                    </span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2.5" />
                  {remaining > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Faltan {formatCurrency(remaining)}
                      {daysLeft > 0 &&
                        ` · ${formatCurrency(Math.ceil(remaining / daysLeft))}/dia`}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Per-person breakdown */}
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(NAMES).map(([personEmail, name]) => (
                <div
                  key={personEmail}
                  className={`rounded-lg p-3 text-center ${
                    personEmail === email
                      ? "bg-primary/10 ring-1 ring-primary/20"
                      : "bg-muted/50"
                  }`}
                >
                  <p className="text-xs text-muted-foreground">{name}</p>
                  <p className="mt-0.5 text-xl font-bold">
                    {formatCurrency(contributions[personEmail] ?? 0)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm font-medium">
              Tu ahorro este mes, {getName(email)}
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder={myAmount > 0 ? String(myAmount) : "0"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <Button onClick={handleSave} disabled={saving || !amount}>
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

        {/* Days remaining */}
        {daysLeft > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {daysLeft} dias restantes en el mes
          </p>
        )}
      </main>
    </>
  );
}
