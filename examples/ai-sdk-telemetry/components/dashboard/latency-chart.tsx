"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { LatencyRow } from "@/app/lib/data";

const config = {
  p50: { label: "p50", color: "var(--chart-1)" },
  p95: { label: "p95", color: "var(--chart-2)" },
  p99: { label: "p99", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function LatencyChart({ data }: { data: LatencyRow[] }) {
  if (data.length === 0) {
    return <Empty />;
  }
  return (
    <ChartContainer config={config} className="min-h-[240px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="tool" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={36} unit="ms" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="p50" fill="var(--color-p50)" radius={4} />
        <Bar dataKey="p95" fill="var(--color-p95)" radius={4} />
        <Bar dataKey="p99" fill="var(--color-p99)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function Empty() {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      No tool-call latency yet. Run a generation that uses a tool.
    </div>
  );
}
