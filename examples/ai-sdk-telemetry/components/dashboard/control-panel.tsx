"use client";

import { useActionState, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Database, Loader2, Play, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { seedAction, runAgentAction, type ActionState } from "@/app/actions";
import type { IndexStatus } from "@/app/lib/data";

export function ControlPanel({
  index,
  hasApiKey,
}: {
  index: IndexStatus;
  hasApiKey: boolean;
}) {
  return (
    <div className="flex h-full flex-col gap-4">
      <IndexCard index={index} />
      <GenerateCard hasApiKey={hasApiKey} />
    </div>
  );
}

function IndexCard({ index }: { index: IndexStatus }) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="size-4" />
            Index
          </CardTitle>
          {index.exists ? (
            <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
              <CheckCircle2 className="size-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="destructive">Missing</Badge>
          )}
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 text-sm sm:grid-cols-5">
          <Fact label="name" value={index.name} mono />
          <Fact label="type" value={index.dataType} mono />
          <Fact label="fields" value={index.fieldCount.toLocaleString()} />
          <Fact label="generations" value={index.generations.toLocaleString()} />
          <Fact label="tool calls" value={index.toolCalls.toLocaleString()} />
        </div>
      </CardContent>
    </Card>
  );
}

function GenerateCard({ hasApiKey }: { hasApiKey: boolean }) {
  const [runState, runFormAction, runPending] = useActionState<ActionState, FormData>(
    runAgentAction,
    { status: "idle" }
  );
  const [seedState, setSeedState] = useState<ActionState>({ status: "idle" });
  const [seedPending, startSeed] = useTransition();

  const onSeed = () => startSeed(async () => setSeedState(await seedAction()));

  return (
    <Card className="flex-1">
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4" />
            Generate telemetry
          </CardTitle>
          <CardDescription className="text-xs">
            Run the AI SDK with the integration wired in — events land in the index and the charts
            update.
          </CardDescription>
        </div>

        <GatedControl hasApiKey={hasApiKey}>
          <form action={runFormAction} className="flex gap-2">
            <Input
              name="prompt"
              placeholder="Ask the agent…"
              defaultValue="What's the weather in Paris and Tokyo?"
              disabled={runPending || !hasApiKey}
            />
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={runPending || !hasApiKey}
            >
              {runPending ? <Loader2 className="animate-spin" /> : <Play />}
              Run
            </Button>
          </form>
        </GatedControl>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          OR
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex items-center gap-3">
          <GatedControl hasApiKey={hasApiKey}>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onSeed}
              disabled={seedPending || !hasApiKey}
            >
              {seedPending ? <Loader2 className="animate-spin" /> : <Database />}
              Seed sample data
            </Button>
          </GatedControl>
          <span className="text-xs text-muted-foreground">Runs 5 sample prompts.</span>
        </div>

        {hasApiKey ? (
          <ResultMessage
            runState={runState}
            seedState={seedState}
            pending={runPending || seedPending}
          />
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="size-4 shrink-0" />
            Set <code className="font-mono text-xs">OPENAI_API_KEY</code> in the backend to enable
            data ingestion.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Disabled controls don't fire pointer events, so when the key is missing we wrap
// them in a tooltip trigger that carries the not-allowed cursor and explains why.
function GatedControl({
  hasApiKey,
  children,
}: {
  hasApiKey: boolean;
  children: React.ReactNode;
}) {
  if (hasApiKey) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-not-allowed">{children}</div>
      </TooltipTrigger>
      <TooltipContent>
        Set OPENAI_API_KEY in the backend to enable data ingestion.
      </TooltipContent>
    </Tooltip>
  );
}

function Fact({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-[13px]" : "font-medium tabular-nums"}>{value}</span>
    </div>
  );
}

function ResultMessage({
  runState,
  seedState,
  pending,
}: {
  runState: ActionState;
  seedState: ActionState;
  pending: boolean;
}) {
  if (pending) {
    return (
      <p className="text-sm text-muted-foreground">Calling the model — this can take a few seconds…</p>
    );
  }

  const error =
    runState.status === "error"
      ? runState.message
      : seedState.status === "error"
        ? seedState.message
        : null;

  if (error) {
    return (
      <p className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="size-4 shrink-0" />
        {error}
      </p>
    );
  }

  if (seedState.status === "seeded") {
    const tokens = seedState.results.reduce((sum, r) => sum + r.totalTokens, 0);
    return (
      <p className="text-sm text-emerald-600">
        Seeded {seedState.results.length} generations · {tokens.toLocaleString()} tokens.
      </p>
    );
  }

  if (runState.status === "ran") {
    return (
      <div className="space-y-1 rounded-md border bg-muted/40 p-3 text-sm">
        <p className="text-xs text-muted-foreground">
          finishReason={runState.result.finishReason} ·{" "}
          {runState.result.totalTokens.toLocaleString()} tokens
        </p>
        <p className="line-clamp-2 whitespace-pre-wrap">{runState.result.text}</p>
      </div>
    );
  }

  return null;
}
