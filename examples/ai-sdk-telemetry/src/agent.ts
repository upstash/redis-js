import { generateText, stepCountIs, tool, type ToolSet } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { redisSearchTelemetry } from "./telemetry";

// Every model call here runs with the Redis Search telemetry integration wired
// in, so each generation emits a `generation` event (and a `toolCall` event per
// tool invocation) into the index. This module is the single source of truth
// for "run an agent" — used by both the seed script and the dashboard's server
// actions, so the UI and CLI produce identical telemetry.

const model = openai("gpt-4o-mini");

// A tiny tool so tool-using generations produce tool-call telemetry as well as
// generation telemetry. Returns canned data — no external API needed.
export const weatherTool = tool({
  description: "Get the current weather for a city.",
  inputSchema: z.object({
    city: z.string().describe("City name, e.g. 'Paris'"),
  }),
  execute: async ({ city }) => {
    // Pretend to do work so durationMs is non-zero.
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 80));
    const temp = Math.round(10 + Math.random() * 20);
    return { city, temperatureC: temp, condition: "Partly cloudy" };
  },
});

// A tool that always throws. Unlike a failed LLM call (which throws before
// onFinish and records nothing — see README), a throwing tool IS captured: the
// SDK reports it via onToolCallFinish with success=false, and the generation
// still finishes normally. This is how failed tool-call telemetry is produced.
export const statusTool = tool({
  description: "Check whether a backend service is currently healthy.",
  inputSchema: z.object({
    service: z.string().describe("Service name, e.g. 'payments'"),
  }),
  // Annotate the return type so the tool's output isn't inferred as `never`
  // (it only ever throws), which would break the ToolSet type.
  execute: async (): Promise<{ healthy: boolean }> => {
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 60));
    throw new Error("status backend unavailable");
  },
});

export type GenerationInput = {
  functionId: string;
  prompt: string;
  // Which tool (if any) to expose to the model.
  tool?: "weather" | "status";
  // Cap output tokens to force a `length` finish reason.
  maxOutputTokens?: number;
  // Stop after the first step so the run ends on a `tool-calls` finish reason.
  stopAfterFirstStep?: boolean;
};

export type GenerationResult = {
  functionId: string;
  finishReason: string;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  text: string;
};

// A representative mix that exercises several finish reasons and both telemetry
// event types:
// - weather-bot: tool call → `stop` (full run) and `tool-calls` (stop early)
// - summarizer:  plain generation → `stop`
// - essayist:    output capped → `length`
// - status-bot:  throwing tool → `stop` generation + a failed tool call
export const SAMPLE_PROMPTS: GenerationInput[] = [
  { functionId: "weather-bot", prompt: "What's the weather in Paris and Tokyo?", tool: "weather" },
  {
    functionId: "weather-bot",
    prompt: "How's the weather in Berlin right now?",
    tool: "weather",
    stopAfterFirstStep: true,
  },
  {
    functionId: "summarizer",
    prompt: "Summarize what a vector database is in one sentence.",
  },
  {
    functionId: "essayist",
    prompt: "Write a long, detailed essay about HTTP caching strategies.",
    maxOutputTokens: 24,
  },
  {
    functionId: "status-bot",
    prompt: "Check the status of the payments service, then tell me whether it's healthy.",
    tool: "status",
  },
];

// Runs a single generation with telemetry enabled and returns a compact,
// serializable summary (safe to return from a server action).
export async function runGeneration({
  functionId,
  prompt,
  tool: toolKind,
  maxOutputTokens,
  stopAfterFirstStep,
}: GenerationInput): Promise<GenerationResult> {
  const tools: ToolSet | undefined =
    toolKind === "weather"
      ? { getWeather: weatherTool }
      : toolKind === "status"
        ? { checkStatus: statusTool }
        : undefined;

  const result = await generateText({
    model,
    prompt,
    tools,
    maxOutputTokens,
    stopWhen: stepCountIs(stopAfterFirstStep ? 1 : 5),
    experimental_telemetry: {
      isEnabled: true,
      functionId,
      // One integration instance per call → one buffer per generation.
      integrations: [redisSearchTelemetry()],
    },
  });

  return {
    functionId,
    finishReason: result.finishReason,
    totalTokens: result.totalUsage.totalTokens ?? 0,
    inputTokens: result.totalUsage.inputTokens ?? 0,
    outputTokens: result.totalUsage.outputTokens ?? 0,
    text: result.text,
  };
}

// Runs the full sample set sequentially and returns every result.
export async function seedSampleData(): Promise<GenerationResult[]> {
  const results: GenerationResult[] = [];
  for (const input of SAMPLE_PROMPTS) {
    results.push(await runGeneration(input));
  }
  return results;
}
