import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { HLenCommand } from "./hlen";
import { HMSetCommand } from "./hmset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("with existing hash", () => {
  test("returns correct number of keys", async () => {
    const key = newKey();
    const field1 = randomID();
    const field2 = randomID();

    const kv: Record<string, string> = {};
    kv[field1] = randomID();
    kv[field2] = randomID();
    await new HMSetCommand([key, kv]).exec(client);
    const res = await new HLenCommand([key]).exec(client);
    expect(res).toEqual(2);
  });
});
