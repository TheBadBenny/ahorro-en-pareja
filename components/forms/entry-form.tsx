"use client";

import { useState, useEffect } from "react";
import type { MonthlyFinancialEntry } from "@/types";
import { getDaysRemainingInMonth, getMonthName } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, RotateCcw } from "lucide-react";

interface EntryFormProps {
  existingEntry?: MonthlyFinancialEntry | null;
  onSave: (entry: MonthlyFinancialEntry) => void;
}

function createBlankEntry(): MonthlyFinancialEntry {
  const now = new Date();
  return {
    id: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    personASaved: 0,
    personBSaved: 0,
    totalSaved: 0,
    currentDate: now.toISOString().split("T")[0],
    daysRemaining: getDaysRemainingInMonth(),
    extraordinaryPaid: 0,
    extraordinaryPlanned: 0,
    weddingFund: 0,
    housingFund: 0,
    emergencyFund: 0,
    totalLiquidity: 0,
    indexPortfolio: 0,
    crypto: 0,
    notes: "",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export function EntryForm({ existingEntry, onSave }: EntryFormProps) {
  const [form, setForm] = useState<MonthlyFinancialEntry>(
    existingEntry ?? createBlankEntry(),
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existingEntry) setForm(existingEntry);
  }, [existingEntry]);

  // Auto-calculate total
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      totalSaved: prev.personASaved + prev.personBSaved,
    }));
  }, [form.personASaved, form.personBSaved]);

  function handleNumber(field: keyof MonthlyFinancialEntry, raw: string) {
    const value = raw === "" ? 0 : parseFloat(raw);
    if (isNaN(value)) return;
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date();
    onSave({
      ...form,
      currentDate: now.toISOString().split("T")[0],
      daysRemaining: getDaysRemainingInMonth(),
      updatedAt: now.toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setForm(existingEntry ?? createBlankEntry());
  }

  const numField = (
    label: string,
    field: keyof MonthlyFinancialEntry,
    placeholder = "0",
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={field} className="text-sm">
        {label}
      </Label>
      <Input
        id={field}
        type="number"
        min="0"
        step="any"
        placeholder={placeholder}
        value={form[field] === 0 ? "" : form[field]}
        onChange={(e) => handleNumber(field, e.target.value)}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Datos de{" "}
          <span className="capitalize">
            {getMonthName(form.month)} {form.year}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Savings */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Ahorro del mes
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {numField("Persona A", "personASaved")}
              {numField("Persona B", "personBSaved")}
            </div>
            <div className="mt-3 rounded-lg bg-muted/50 p-3 text-center">
              <span className="text-sm text-muted-foreground">
                Total ahorrado:{" "}
              </span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                }).format(form.personASaved + form.personBSaved)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Extraordinary expenses */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Gastos extraordinarios
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {numField("Ya pagados", "extraordinaryPaid")}
              {numField("Previstos", "extraordinaryPlanned")}
            </div>
          </div>

          <Separator />

          {/* Funds */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Fondos y patrimonio
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {numField("Fondo Boda", "weddingFund")}
              {numField("Fondo Vivienda", "housingFund")}
              {numField("Colchon / Emergencia", "emergencyFund")}
              {numField("Liquidez total", "totalLiquidity")}
              {numField("Cartera indices", "indexPortfolio")}
              {numField("Cripto", "crypto")}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm">
              Notas
            </Label>
            <Textarea
              id="notes"
              placeholder="Comentarios del mes..."
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button type="submit" className="flex-1 sm:flex-none">
              <Save className="mr-2 h-4 w-4" />
              {saved ? "Guardado!" : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Resetear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
