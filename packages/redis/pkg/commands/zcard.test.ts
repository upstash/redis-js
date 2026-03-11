import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { ZAddCommand } from "./zadd";
import { ZCardCommand } from "./zcard";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the cardinality", async () => {
  const key = newKey();
  await new ZAddCommand([key, { score: 1, member: "member1" }]).exec(client);
  const res = await new ZCardCommand([key]).exec(client);
  expect(res).toEqual(1);
});
