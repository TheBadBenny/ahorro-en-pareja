"use client";

import { DEFAULT_GOALS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

interface RadialProgressChartProps {
  totalSaved: number;
}

export function RadialProgressChart({
  totalSaved,
}: RadialProgressChartProps) {
  const percent = Math.min(
    Math.round((totalSaved / DEFAULT_GOALS.target) * 100),
    100,
  );

  const data = [{ value: percent, fill: "hsl(210, 70%, 55%)" }];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Progreso mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              data={data}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                tick={false}
                angleAxisId={0}
              />
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background={{ fill: "hsl(var(--muted))" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{percent}%</span>
            <span className="text-sm text-muted-foreground">del objetivo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
