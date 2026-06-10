import { Activity, Coins, Gauge, Wrench } from "lucide-react";
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
import { ControlPanel } from "@/components/dashboard/control-panel";
import { CodeSnippets } from "@/components/dashboard/code-snippets";

// Aggregations are read fresh on every request — never cache the dashboard.
export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getDashboardData();
  // OpenAI key lives only on the server — read it here and pass a boolean to the
  // client so the data-ingestion buttons can be disabled when it's missing.
  const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
  const avgTokensPerGen = data.totalGenerations
    ? Math.round(data.totalTokens / data.totalGenerations)
    : 0;

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

      <section className="grid gap-4 lg:grid-cols-2">
        <CodeSnippets />
        <ControlPanel index={data.index} hasApiKey={hasApiKey} />
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Activity className="size-4" />}
          label="Generations"
          value={data.totalGenerations.toLocaleString()}
          sub={`${data.last30mGenerations.toLocaleString()} in last 30 min`}
        />
        <StatCard
          icon={<Coins className="size-4" />}
          label="Total tokens"
          value={data.totalTokens.toLocaleString()}
          sub={`${data.totalInputTokens.toLocaleString()} in · ${data.totalOutputTokens.toLocaleString()} out`}
        />
        <StatCard
          icon={<Wrench className="size-4" />}
          label="Tool calls"
          value={data.index.toolCalls.toLocaleString()}
          sub={`${data.failedToolCalls.toLocaleString()} failed`}
        />
        <StatCard
          icon={<Gauge className="size-4" />}
          label="Avg tokens / gen"
          value={avgTokensPerGen.toLocaleString()}
          sub="across all generations"
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
            <CardTitle>Tokens per agent</CardTitle>
            <CardDescription>
              Average tokens from a <code>$stats</code> aggregation grouped by agent (
              <code>functionId</code>).
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
                    <TableHead>Agent</TableHead>
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
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
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
        {sub ? <p className="mt-1 text-xs text-muted-foreground tabular-nums">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}
