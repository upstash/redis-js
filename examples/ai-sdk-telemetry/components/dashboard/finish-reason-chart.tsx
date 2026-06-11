"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { FinishReasonRow } from "@/app/lib/data";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const config = { count: { label: "Generations" } } satisfies ChartConfig;

export function FinishReasonChart({ data }: { data: FinishReasonRow[] }) {
  if (data.length === 0) {
    return <Empty />;
  }
  const total = data.reduce((sum, d) => sum + d.count, 0);
  return (
    <ChartContainer config={config} className="mx-auto aspect-square min-h-[240px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="reason" hideLabel />} />
        <Pie data={data} dataKey="count" nameKey="reason" innerRadius={60} strokeWidth={4}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                      {total.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                      generations
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

function Empty() {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      No generations recorded yet.
    </div>
  );
}
