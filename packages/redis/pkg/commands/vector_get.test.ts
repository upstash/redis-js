import { keygen, newHttpClient } from "../test-utils";
import { afterAll, beforeAll, expect, test } from "bun:test";
import { VectorAddCommand } from "./vector_add";
import { VectorCreateCommand } from "./vector_create";
import { VectorDropCommand } from "./vector_drop";
import { VectorGetCommand } from "./vector_get";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
const index = newKey();

beforeAll(async () => {
  await new VectorCreateCommand([index, { dimension: 2, metric: "EUCLIDEAN" }]).exec(client);
});
afterAll(async () => {
  await new VectorDropCommand([index]).exec(client);
  await cleanup();
});

test("returns the stored vector as numbers", async () => {
  await new VectorAddCommand([index, "a", [1.5, -2]]).exec(client);
  const res = await new VectorGetCommand([index, "a"]).exec(client);
  expect(res).toEqual([1.5, -2]);
});

test("returns null for a missing id", async () => {
  const res = await new VectorGetCommand([index, "missing"]).exec(client);
  expect(res).toBeNull();
});

test("throws for a missing index", async () => {
  await expect(new VectorGetCommand([newKey(), "a"]).exec(client)).rejects.toThrow(/not found/);
});
