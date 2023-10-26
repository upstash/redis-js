import { keygen, newHttpClient, randomID } from "../test-utils";
import { Command } from "./command";

import { afterAll, describe, expect, test } from "bun:test";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("deserialize large numbers", () => {
  test("returns the correct number", async () => {
    const key = newKey();
    const field = randomID();
    const value = "101600000000150081467";

    await new Command(["hset", key, field, value]).exec(client);

    const res = await new Command(["hget", key, field]).exec(client);
    expect(res).toEqual(value);
  });
});
