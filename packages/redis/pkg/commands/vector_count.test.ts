import { keygen, newHttpClient } from "../test-utils";
import { afterAll, beforeAll, expect, test } from "bun:test";
import { VectorAddCommand } from "./vector_add";
import { VectorCountCommand } from "./vector_count";
import { VectorCreateCommand } from "./vector_create";
import { VectorDelCommand } from "./vector_del";
import { VectorDropCommand } from "./vector_drop";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
const index = newKey();

beforeAll(async () => {
  await new VectorCreateCommand([index, { dimension: 1, metric: "EUCLIDEAN" }]).exec(client);
});
afterAll(async () => {
  await new VectorDropCommand([index]).exec(client);
  await cleanup();
});

test("counts vectors in the index", async () => {
  expect(await new VectorCountCommand([index]).exec(client)).toEqual(0);
  await new VectorAddCommand([index, "a", [1]]).exec(client);
  await new VectorAddCommand([index, "b", [2]]).exec(client);
  expect(await new VectorCountCommand([index]).exec(client)).toEqual(2);
  // overwriting does not change the count
  await new VectorAddCommand([index, "a", [3]]).exec(client);
  expect(await new VectorCountCommand([index]).exec(client)).toEqual(2);
  await new VectorDelCommand([index, "a"]).exec(client);
  expect(await new VectorCountCommand([index]).exec(client)).toEqual(1);
});

test("returns 0 for a missing index", async () => {
  expect(await new VectorCountCommand([newKey()]).exec(client)).toEqual(0);
});
