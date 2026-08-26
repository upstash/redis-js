import { keygen, newHttpClient } from "../test-utils";
import { afterAll, beforeAll, expect, test } from "bun:test";
import { VectorAddCommand } from "./vector_add";
import { VectorCreateCommand } from "./vector_create";
import { VectorDelCommand } from "./vector_del";
import { VectorDropCommand } from "./vector_drop";
import { VectorGetCommand } from "./vector_get";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
const index = newKey();

beforeAll(async () => {
  await new VectorCreateCommand([index, { dimension: 2, metric: "DOT" }]).exec(client);
});
afterAll(async () => {
  await new VectorDropCommand([index]).exec(client);
  await cleanup();
});

test("deletes an existing vector", async () => {
  await new VectorAddCommand([index, "a", [1, 2]]).exec(client);
  expect(await new VectorDelCommand([index, "a"]).exec(client)).toEqual(1);
  expect(await new VectorGetCommand([index, "a"]).exec(client)).toBeNull();
});

test("returns 0 for a missing id", async () => {
  expect(await new VectorDelCommand([index, "missing"]).exec(client)).toEqual(0);
});
