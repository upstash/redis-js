import { keygen, newHttpClient } from "../test-utils";
import { afterAll, beforeAll, expect, test } from "bun:test";
import { VectorAddCommand } from "./vector_add";
import { VectorCreateCommand } from "./vector_create";
import { VectorDropCommand } from "./vector_drop";
import { VectorQueryCommand } from "./vector_query";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
const index = newKey();

beforeAll(async () => {
  await new VectorCreateCommand([index, { dimension: 3, metric: "COSINE" }]).exec(client);
  await new VectorAddCommand([index, "x", [1, 0, 0]]).exec(client);
  await new VectorAddCommand([index, "y", [0, 1, 0]]).exec(client);
  // numeric-looking id must stay a string in the result
  await new VectorAddCommand([index, "123", [0.9, 0.1, 0]]).exec(client);
});
afterAll(async () => {
  await new VectorDropCommand([index]).exec(client);
  await cleanup();
});

test("returns the nearest neighbours ordered by score", async () => {
  const res = await new VectorQueryCommand([index, { vector: [1, 0, 0], topK: 2 }]).exec(client);
  expect(res).toHaveLength(2);
  expect(res[0]).toEqual({ id: "x", score: 1 });
  expect(res[1].id).toBe("123");
  expect(typeof res[1].id).toBe("string");
  expect(res[1].score).toBeGreaterThan(0.9);
  expect(res[1].score).toBeLessThan(1);
});

test("respects topK", async () => {
  const res = await new VectorQueryCommand([index, { vector: [1, 0, 0], topK: 1 }]).exec(client);
  expect(res).toEqual([{ id: "x", score: 1 }]);
});

test("accepts a profile and Float32Array input", async () => {
  const res = await new VectorQueryCommand([
    index,
    { vector: new Float32Array([0, 1, 0]), topK: 1, profile: "PRECISE" },
  ]).exec(client);
  expect(res).toEqual([{ id: "y", score: 1 }]);
});

test("accepts a base64 FP32 input", async () => {
  const res = await new VectorQueryCommand([
    index,
    { vector: { base64: "AACAPwAAAAAAAAAA" }, topK: 1, profile: "FAST" },
  ]).exec(client);
  expect(res).toEqual([{ id: "x", score: 1 }]);
});

test("throws for a missing index", async () => {
  await expect(
    new VectorQueryCommand([newKey(), { vector: [1, 0, 0], topK: 1 }]).exec(client)
  ).rejects.toThrow(/not found/);
});
