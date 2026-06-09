import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { redisSearchTelemetry } from "../src/telemetry";
import { weatherTool } from "./_shared";

// Generates real telemetry by making a handful of model calls with the Redis
// Search integration wired in. Tool-using calls emit both toolCall and
// generation events; plain calls emit a generation event only.
const model = openai("gpt-4o-mini");

const prompts: Array<{ functionId: string; prompt: string; withTool: boolean }> = [
  { functionId: "weather-bot", prompt: "What's the weather in Paris and Tokyo?", withTool: true },
  { functionId: "weather-bot", prompt: "How's the weather in Berlin right now?", withTool: true },
  { functionId: "summarizer", prompt: "Summarize what a vector database is in one sentence.", withTool: false },
  { functionId: "summarizer", prompt: "Explain HTTP caching in two sentences.", withTool: false },
];

for (const { functionId, prompt, withTool } of prompts) {
  const result = await generateText({
    model,
    prompt,
    tools: withTool ? { getWeather: weatherTool } : undefined,
    stopWhen: stepCountIs(5),
    experimental_telemetry: {
      isEnabled: true,
      functionId,
      // One integration instance per call → one buffer per generation.
      integrations: [redisSearchTelemetry()],
    },
  });
  console.log(`[${functionId}] finishReason=${result.finishReason} tokens=${result.totalUsage.totalTokens} :: ${result.text.slice(0, 70).replace(/\n/g, " ")}…`);
}

console.log("\nSeeded. Run `npm run analytics` to query the aggregations.");
