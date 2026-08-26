import { keygen, newHttpClient } from "../test-utils";
import { afterAll, expect, test } from "bun:test";
import { VectorAddCommand } from "./vector_add";
import { VectorCreateCommand } from "./vector_create";
import { VectorDropCommand } from "./vector_drop";
import { VectorInfoCommand } from "./vector_info";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("drops an existing index", async () => {
  const key = newKey();
  await new VectorCreateCommand([key, { dimension: 2, metric: "COSINE" }]).exec(client);
  await new VectorAddCommand([key, "a", [1, 0]]).exec(client);
  expect(await new VectorDropCommand([key]).exec(client)).toEqual(1);
  expect(await new VectorInfoCommand([key]).exec(client)).toBeNull();
});

test("returns 0 for a missing index", async () => {
  expect(await new VectorDropCommand([newKey()]).exec(client)).toEqual(0);
});
