import { keygen, newHttpClient } from "../test-utils";
import { it, expect, afterAll } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZRevRankCommand } from "./zrevrank";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
	"returns the rank",
	async () => {
		const key = newKey();

  await new ZAddCommand([
    key,
    { score: 1, member: "member1" },
    { score: 2, member: "member2" },
    { score: 3, member: "member3" },
  ]).exec(client)

  const res = await new ZRevRankCommand([key, "member2"]).exec(client)
  expect(res).toBe(1)
})
