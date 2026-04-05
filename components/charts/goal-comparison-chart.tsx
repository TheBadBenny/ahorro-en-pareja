"use client";

import { DEFAULT_GOALS } from "@/types";
import { formatCurrency } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Tooltip,
} from "recharts";

interface GoalComparisonChartProps {
  totalSaved: number;
}

export function GoalComparisonChart({
  totalSaved,
}: GoalComparisonChartProps) {
  const data = [
    { name: "Actual", value: totalSaved },
    { name: "Minimo", value: DEFAULT_GOALS.minimum },
    { name: "Recomendado", value: DEFAULT_GOALS.target },
    { name: "Comodo", value: DEFAULT_GOALS.comfortable },
  ];

  const colors = ["hsl(210, 70%, 55%)", "#94a3b8", "#f59e0b", "#10b981"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ahorro vs Objetivos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
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
                formatter={(value) => [formatCurrency(Number(value)), ""]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
