import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { ZAddCommand } from "./zadd";
import { ZCountCommand } from "./zcount";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the cardinality", async () => {
  const key = newKey();
  await new ZAddCommand([key, { score: 1, member: "member1" }]).exec(client);
  const res = await new ZCountCommand([key, 0, 2]).exec(client);
  expect(res).toEqual(1);
});
