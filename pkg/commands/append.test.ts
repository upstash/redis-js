import { keygen, newHttpClient, randomID } from "../test-utils";
import { AppendCommand } from "./append";

import { afterAll, describe, expect, test } from "bun:test";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key is not set", () => {
  test("appends to empty value", async () => {
    const key = newKey();
    const value = randomID();
    const res = await new AppendCommand([key, value]).exec(client);
    expect(res).toEqual(value.length);
  });
});

describe("when key is set", () => {
  test("appends to existing value", async () => {
    const key = newKey();
    const value = randomID();
    const res = await new AppendCommand([key, value]).exec(client);
    expect(res).toEqual(value.length);
    const res2 = await new AppendCommand([key, "_"]).exec(client);
    expect(res2).toEqual(value.length + 1);
  });
});
