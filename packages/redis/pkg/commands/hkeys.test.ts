import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { HKeysCommand } from "./hkeys";
import { HMSetCommand } from "./hmset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("with existing hash", () => {
  test("returns all keys", async () => {
    const key = newKey();
    const kv = {
      [randomID()]: randomID(),
      [randomID()]: randomID(),
    };
    await new HMSetCommand([key, kv]).exec(client);
    const res = await new HKeysCommand([key]).exec(client);
    expect(res.sort()).toEqual(Object.keys(kv).sort());
  });
});
