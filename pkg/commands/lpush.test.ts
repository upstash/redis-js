import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, expect, it } from "@jest/globals";
import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the length after command",
  async () => {
    const key = newKey();
    const res = await new LPushCommand(key, randomUUID()).exec(client);
    expect(res).toEqual(1);
    const res2 = await new LPushCommand(key, randomUUID(), randomUUID()).exec(
      client,
    );

    expect(res2).toEqual(3);
  },
);
