import { tool } from "ai";
import { z } from "zod";

// A tiny tool so generations produce tool-call telemetry as well as generation
// telemetry. It returns canned data — no external API needed.
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
