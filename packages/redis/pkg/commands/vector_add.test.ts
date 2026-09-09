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
  await new VectorCreateCommand([index, { dimension: 3, metric: "COSINE" }]).exec(client);
});
afterAll(async () => {
  await new VectorDropCommand([index]).exec(client);
  await cleanup();
});

test("adds a vector from a number array", async () => {
  const res = await new VectorAddCommand([index, "a", [1, 0, 0]]).exec(client);
  expect(res).toEqual(1);
  expect(await new VectorGetCommand([index, "a"]).exec(client)).toEqual([1, 0, 0]);
});

test("returns 0 when overwriting an existing id", async () => {
  await new VectorAddCommand([index, "b", [1, 0, 0]]).exec(client);
  const res = await new VectorAddCommand([index, "b", [0, 1, 0]]).exec(client);
  expect(res).toEqual(0);
  expect(await new VectorGetCommand([index, "b"]).exec(client)).toEqual([0, 1, 0]);
});

test("adds a vector from a Float32Array", async () => {
  const res = await new VectorAddCommand([index, "c", new Float32Array([0.5, 0.25, -1])]).exec(
    client
  );
  expect(res).toEqual(1);
  expect(await new VectorGetCommand([index, "c"]).exec(client)).toEqual([0.5, 0.25, -1]);
});

test("adds a vector from a base64 FP32 blob", async () => {
  // [1, 0, 0] as little-endian float32
  const res = await new VectorAddCommand([index, "d", { base64: "AACAPwAAAAAAAAAA" }]).exec(client);
  expect(res).toEqual(1);
  expect(await new VectorGetCommand([index, "d"]).exec(client)).toEqual([1, 0, 0]);
});

test("rejects a vector with the wrong dimension", async () => {
  await expect(new VectorAddCommand([index, "e", [1, 0]]).exec(client)).rejects.toThrow();
});
