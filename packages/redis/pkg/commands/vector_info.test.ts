import { keygen, newHttpClient } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { VectorCreateCommand } from "./vector_create";
import { VectorDropCommand } from "./vector_drop";
import { VectorInfoCommand } from "./vector_info";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns dimension and metric", async () => {
  const key = newKey();
  await new VectorCreateCommand([key, { dimension: 5, metric: "EUCLIDEAN" }]).exec(client);
  const res = await new VectorInfoCommand([key]).exec(client);
  expect(res).toEqual({ dimension: 5, metric: "EUCLIDEAN" });
  await new VectorDropCommand([key]).exec(client);
});

test("returns null for a missing index", async () => {
  expect(await new VectorInfoCommand([newKey()]).exec(client)).toBeNull();
});
