"use server";

import { revalidatePath } from "next/cache";
import { createTelemetryIndex } from "@/src/index-setup";
import { runGeneration, seedSampleData, type GenerationResult } from "@/src/agent";

export type ActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "seeded"; results: GenerationResult[] }
  | { status: "ran"; result: GenerationResult };

// Runs the sample prompt set, producing real generation + tool-call telemetry,
// then revalidates the dashboard so the new events show up immediately.
export async function seedAction(): Promise<ActionState> {
  try {
    await createTelemetryIndex();
    const results = await seedSampleData();
    revalidatePath("/");
    return { status: "seeded", results };
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }
}

// Runs a single ad-hoc generation from a user-supplied prompt. Always wires the
// weather tool so the agent can emit tool-call telemetry when it chooses to.
export async function runAgentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const prompt = String(formData.get("prompt") ?? "").trim();
  if (!prompt) {
    return { status: "error", message: "Enter a prompt to run the agent." };
  }

  try {
    await createTelemetryIndex();
    const result = await runGeneration({ functionId: "playground", prompt, tool: "weather" });
    revalidatePath("/");
    return { status: "ran", result };
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
