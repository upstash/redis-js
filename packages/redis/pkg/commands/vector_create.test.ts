import { keygen, newHttpClient } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { VectorCreateCommand } from "./vector_create";
import { VectorDropCommand } from "./vector_drop";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("creates an index", async () => {
  const key = newKey();
  const res = await new VectorCreateCommand([key, { dimension: 3, metric: "COSINE" }]).exec(client);
  expect(res).toEqual(1);
  await new VectorDropCommand([key]).exec(client);
});

test("throws when the index already exists", async () => {
  const key = newKey();
  await new VectorCreateCommand([key, { dimension: 3, metric: "EUCLIDEAN" }]).exec(client);
  await expect(
    new VectorCreateCommand([key, { dimension: 3, metric: "EUCLIDEAN" }]).exec(client)
  ).rejects.toThrow(/already exists/);
  await new VectorDropCommand([key]).exec(client);
});

test("existsOk returns 0 for an existing index with the same config", async () => {
  const key = newKey();
  await new VectorCreateCommand([key, { dimension: 3, metric: "DOT" }]).exec(client);
  const res = await new VectorCreateCommand([
    key,
    { dimension: 3, metric: "DOT", existsOk: true },
  ]).exec(client);
  expect(res).toEqual(0);
  await new VectorDropCommand([key]).exec(client);
});

test("existsOk throws for an existing index with a different config", async () => {
  const key = newKey();
  await new VectorCreateCommand([key, { dimension: 3, metric: "DOT" }]).exec(client);
  await expect(
    new VectorCreateCommand([key, { dimension: 4, metric: "DOT", existsOk: true }]).exec(client)
  ).rejects.toThrow(/different configuration/);
  await new VectorDropCommand([key]).exec(client);
});
