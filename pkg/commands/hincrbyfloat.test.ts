import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { HIncrByFloatCommand } from "./hincrbyfloat";
import { HSetCommand } from "./hset";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("a", () => {
  test("increments a non-existing value", async () => {
    const key = newKey();
    const field = randomID();
    const res = await new HIncrByFloatCommand([key, field, 2.5]).exec(client);

    expect(res).toEqual(2.5);
  });

  test("increments and existing value", async () => {
    const key = newKey();
    const field = randomID();
    await new HSetCommand([key, { [field]: 5 }]).exec(client);
    const res = await new HIncrByFloatCommand([key, field, 2.5]).exec(client);

    expect(res).toEqual(7.5);
  });
});
