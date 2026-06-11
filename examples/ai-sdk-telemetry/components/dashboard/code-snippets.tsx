"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const INTEGRATION_SNIPPET = `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { redisSearchTelemetry } from "@/src/telemetry";

await generateText({
  model: openai("gpt-4o-mini"),
  prompt,
  experimental_telemetry: {
    isEnabled: true,
    functionId: "weather-bot",
    integrations: [redisSearchTelemetry()],
  },
});`;

const TELEMETRY_SNIPPET = `import { bindTelemetryIntegration } from "ai";
import type {
  TelemetryIntegration, OnFinishEvent, OnToolCallFinishEvent,
} from "ai";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// One integration → a JSON doc per tool call and per generation.
export const redisSearchTelemetry = (): TelemetryIntegration =>
  bindTelemetryIntegration({
    onToolCallFinish: (e: OnToolCallFinishEvent) =>
      redis.json.set(\`ai:event:\${crypto.randomUUID()}\`, "$", {
        type: "toolCall",
        toolName: e.toolCall.toolName,
        success: e.success,
        durationMs: e.durationMs,
        ts: new Date().toISOString(),
      }),
    onFinish: (e: OnFinishEvent) =>
      redis.json.set(\`ai:event:\${crypto.randomUUID()}\`, "$", {
        type: "generation",
        functionId: e.functionId,
        model: e.model?.modelId,
        finishReason: e.finishReason,
        totalTokens: e.totalUsage.totalTokens,
        ts: new Date().toISOString(),
      }),
  });`;

const QUERY_EXAMPLES: { label: string; code: string }[] = [
  {
    label: "Latency",
    code: `// p50 / p95 / p99 latency per tool, successful calls only
await index.aggregate({
  filter: {
    type: { $eq: "toolCall" }, success: { $eq: true }
  },
  aggregations: {
    by_tool: {
      $terms: { field: "toolName", size: 20 },
      $aggs: {
        p: { $percentiles: {
          field: "durationMs", percents: [50, 95, 99]
        }, },
        avg: { $avg: { field: "durationMs" } },
      },
    },
  },
});`,
  },
  {
    label: "Token stats",
    code: `// count / min / max / sum / avg tokens per agent
await index.aggregate({
  filter: { type: { $eq: "generation" }, ts: { $gte: since } },
  aggregations: {
    by_fn: {
      $terms: { field: "functionId" },
      $aggs: { tokens: { $stats: { field: "totalTokens" } } },
    },
  },
});`,
  },
  {
    label: "Failed tools",
    code: `// failed tool calls — $mustNot must be paired with $must
await index.count({
  filter: {
    $and: [
      {
        $must: [{ type: { $eq: "toolCall" } }],
        $mustNot: [{ success: { $eq: true } }],
      },
    ],
  },
});`,
  },
  {
    label: "Recent",
    code: `// most recent generations — replaces sorted sets
await index.query({
  filter: { type: { $eq: "generation" }, ts: { $gte: since } },
  orderBy: { ts: "DESC" },
  limit: 10,
});`,
  },
];

const TABS: { label: string; code: string }[] = [
  { label: "Integrate", code: INTEGRATION_SNIPPET },
  { label: "Telemetry", code: TELEMETRY_SNIPPET },
  ...QUERY_EXAMPLES,
];

export function CodeSnippets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Telemetry in code</CardTitle>
        <CardDescription>
          Add the integration to your AI SDK calls, then read it back — every chart here is one
          Redis Search aggregation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CodeGroup tabs={TABS} />
      </CardContent>
    </Card>
  );
}

function CodeGroup({ tabs }: { tabs: { label: string; code: string }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              i === active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock code={tabs[active].code} />
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10 cursor-pointer rounded-md border bg-background/80 p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </button>
      <Highlight theme={themes.vsLight} code={code} language="tsx">
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="h-60 overflow-auto rounded-md border p-4 text-[12px] leading-relaxed"
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
