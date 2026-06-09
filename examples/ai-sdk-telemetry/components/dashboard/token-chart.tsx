"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { TokenRow } from "@/app/lib/data";

const config = {
  avg: { label: "Avg tokens", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TokenChart({ data }: { data: TokenRow[] }) {
  if (data.length === 0) {
    return <Empty />;
  }
  return (
    <ChartContainer config={config} className="min-h-[240px] w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 12 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          type="category"
          dataKey="functionId"
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="avg" fill="var(--color-avg)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function Empty() {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      No generations in the last 24h.
    </div>
  );
}
