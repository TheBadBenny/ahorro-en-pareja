"use client";

import type { MonthlyFinancialEntry } from "@/types";
import { DEFAULT_GOALS } from "@/types";
import { formatCurrency, getMonthName } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface HistoryChartProps {
  entries: MonthlyFinancialEntry[];
}

export function HistoryChart({ entries }: HistoryChartProps) {
  if (entries.length < 2) return null;

  const data = [...entries]
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    })
    .map((e) => ({
      name: `${getMonthName(e.month).slice(0, 3)} ${e.year.toString().slice(2)}`,
      total: e.totalSaved,
      personA: e.personASaved,
      personB: e.personBSaved,
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Evolucion mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(210, 70%, 55%)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(210, 70%, 55%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "total"
                    ? "Total"
                    : name === "personA"
                      ? "Persona A"
                      : "Persona B",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <ReferenceLine
                y={DEFAULT_GOALS.target}
                stroke="hsl(35, 90%, 55%)"
                strokeDasharray="5 5"
                label={{
                  value: "Objetivo",
                  position: "right",
                  fontSize: 11,
                  fill: "hsl(35, 90%, 55%)",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(210, 70%, 55%)"
                fill="url(#gradTotal)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(210, 70%, 55%)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
