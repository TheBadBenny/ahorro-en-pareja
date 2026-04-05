"use client";

import type { MonthlyFinancialEntry } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Banknote,
  Landmark,
  ShieldCheck,
  Wallet,
  BarChart3,
  Bitcoin,
} from "lucide-react";

interface ExtrasCardProps {
  entry: MonthlyFinancialEntry;
}

export function ExtrasCard({ entry }: ExtrasCardProps) {
  const items = [
    {
      icon: AlertTriangle,
      label: "Gastos extra pagados",
      value: entry.extraordinaryPaid,
      color: "text-red-500",
    },
    {
      icon: AlertTriangle,
      label: "Gastos extra previstos",
      value: entry.extraordinaryPlanned,
      color: "text-amber-500",
    },
    {
      icon: Banknote,
      label: "Fondo Boda",
      value: entry.weddingFund,
      color: "text-purple-500",
    },
    {
      icon: Landmark,
      label: "Fondo Vivienda",
      value: entry.housingFund,
      color: "text-blue-500",
    },
    {
      icon: ShieldCheck,
      label: "Colchon / Emergencia",
      value: entry.emergencyFund,
      color: "text-emerald-500",
    },
    {
      icon: Wallet,
      label: "Liquidez total",
      value: entry.totalLiquidity,
      color: "text-sky-500",
    },
    {
      icon: BarChart3,
      label: "Cartera indices",
      value: entry.indexPortfolio,
      color: "text-orange-500",
    },
    {
      icon: Bitcoin,
      label: "Cripto",
      value: entry.crypto,
      color: "text-yellow-500",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Detalle financiero</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg bg-muted/40 p-3"
            >
              <item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-sm font-semibold">
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
