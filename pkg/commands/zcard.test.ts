import { keygen, newHttpClient } from "../test-utils";
import { afterAll, expect, it } from "@jest/globals";
import { ZAddCommand } from "./zadd";
import { ZCardCommand } from "./zcard";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the cardinality",
  async () => {
    const key = newKey();
    await new ZAddCommand(key, { score: 1, member: "member1" }).exec(client);
    const res = await new ZCardCommand(key).exec(client);
    expect(res).toBe(1);
  },
);
