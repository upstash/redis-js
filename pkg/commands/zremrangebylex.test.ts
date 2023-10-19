import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { ZAddCommand } from "./zadd";

import { ZRemRangeByLexCommand } from "./zremrangebylex";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the number of elements removed", async () => {
  const key = newKey();
  await new ZAddCommand([
    key,
    { score: 0, member: "aaaa" },
    { score: 0, member: "b" },
    { score: 0, member: "c" },
    { score: 0, member: "d" },
    { score: 0, member: "e" },
  ]).exec(client);

  const res = await new ZRemRangeByLexCommand([key, "[b", "[e"]).exec(client);
  expect(res).toEqual(4);
});
