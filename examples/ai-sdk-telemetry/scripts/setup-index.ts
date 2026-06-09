import { createTelemetryIndex } from "../src/index-setup";
import { INDEX_NAME, EVENT_PREFIX } from "../src/redis";

// Run once before anything else. Safe to re-run (existsOk: true).
const index = await createTelemetryIndex();
console.log(`Index "${INDEX_NAME}" is ready, tracking keys under "${EVENT_PREFIX}".`);
console.log("Reference:", index !== undefined ? "obtained" : "n/a");
