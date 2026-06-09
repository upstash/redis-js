import { Activity, AlertTriangle, Coins, Database } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardData } from "@/app/lib/data";
import { LatencyChart } from "@/components/dashboard/latency-chart";
import { TokenChart } from "@/components/dashboard/token-chart";
import { FinishReasonChart } from "@/components/dashboard/finish-reason-chart";
import { RefreshButton } from "@/components/dashboard/refresh-button";

// Aggregations are read fresh on every request — never cache the dashboard.
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI SDK Telemetry</h1>
          <p className="text-sm text-muted-foreground">
            Live analytics from Upstash Redis Search aggregations — last 24 hours.
          </p>
        </div>
        <RefreshButton />
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Activity className="size-4" />}
          label="Generations"
          value={data.totalGenerations.toLocaleString()}
        />
        <StatCard
          icon={<Coins className="size-4" />}
          label="Total tokens"
          value={data.totalTokens.toLocaleString()}
        />
        <StatCard
          icon={<Database className="size-4" />}
          label="Tools tracked"
          value={data.latency.length.toLocaleString()}
        />
        <StatCard
          icon={<AlertTriangle className="size-4" />}
          label="Failed tool calls"
          value={data.failedToolCalls.toLocaleString()}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tool latency</CardTitle>
            <CardDescription>
              p50 / p95 / p99 per tool (ms), from <code>$percentiles</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LatencyChart data={data.latency} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average tokens per function</CardTitle>
            <CardDescription>
              From a <code>$stats</code> aggregation grouped by functionId.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TokenChart data={data.tokens} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Finish reasons</CardTitle>
            <CardDescription>
              Generation outcomes grouped with <code>$terms</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinishReasonChart data={data.finishReasons} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent generations</CardTitle>
            <CardDescription>
              Ordered by <code>ts</code> DESC — no sorted sets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.recent.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No generations in the last 24h.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Function</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                    <TableHead>Finish</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.functionId}</TableCell>
                      <TableCell className="text-muted-foreground">{r.model}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {r.totalTokens.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.finishReason}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {new Date(r.ts).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2">
          {icon}
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
