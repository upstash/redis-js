import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { ZAddCommand } from "./zadd";
import { ZRevRankCommand } from "./zrevrank";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the rank", async () => {
  const key = newKey();

  await new ZAddCommand([
    key,
    { score: 1, member: "member1" },
    { score: 2, member: "member2" },
    { score: 3, member: "member3" },
  ]).exec(client);

  const res = await new ZRevRankCommand([key, "member2"]).exec(client);
  expect(res).toEqual(1);
});
