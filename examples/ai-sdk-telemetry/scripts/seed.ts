import { runGeneration, SAMPLE_PROMPTS } from "../src/agent";

// Generates real telemetry by making a handful of model calls with the Redis
// Search integration wired in (see src/agent.ts). Tool-using calls emit both
// toolCall and generation events; plain calls emit a generation event only.
for (const input of SAMPLE_PROMPTS) {
  const result = await runGeneration(input);
  console.log(
    `[${result.functionId}] finishReason=${result.finishReason} tokens=${result.totalTokens} :: ${result.text
      .slice(0, 70)
      .replace(/\n/g, " ")}…`
  );
}

console.log("\nSeeded. Run `npm run analytics` to query the aggregations.");
