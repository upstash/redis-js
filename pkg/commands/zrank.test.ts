import { keygen, newHttpClient } from "../test-utils";
import { afterAll, expect, it } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZRankCommand } from "./zrank";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the rank",
  async () => {
    const key = newKey();

    await new ZAddCommand(
      key,
      { score: 1, member: "member1" },
      { score: 2, member: "member2" },
      { score: 3, member: "member3" },
    ).exec(client);

    const res = await new ZRankCommand(key, "member2").exec(client);
    expect(res).toBe(1);
  },
);
