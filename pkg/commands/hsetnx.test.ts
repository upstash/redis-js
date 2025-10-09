import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { HGetCommand } from "./hget";
import { HSetCommand } from "./hset";
import { HSetNXCommand } from "./hsetnx";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when hash exists already", () => {
  test("returns 0", async () => {
    const key = newKey();
    const field = randomID();
    const value = randomID();
    const newValue = randomID();
    await new HSetCommand([key, { [field]: value }]).exec(client);
    const res = await new HSetNXCommand([key, field, newValue]).exec(client);
    expect(res).toEqual(0);
    const res2 = await new HGetCommand([key, field]).exec(client);

    expect(res2).toEqual(value);
  });
});
describe("when hash does not exist", () => {
  test("returns 1", async () => {
    const key = newKey();
    const field = randomID();
    const value = randomID();
    const res = await new HSetNXCommand([key, field, value]).exec(client);
    expect(res).toEqual(1);
    const res2 = await new HGetCommand([key, field]).exec(client);

    expect(res2).toEqual(value);
  });
});
