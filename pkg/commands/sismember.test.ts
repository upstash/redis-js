import { keygen, newHttpClient, randomID } from "../test-utils";

import { SAddCommand } from "./sadd";
import { SIsMemberCommand } from "./sismember";

import { afterAll, expect, test, describe } from "bun:test";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when member exists", () => {
  test("returns 1", async () => {
    const key = newKey();
    const value = randomID();
    await new SAddCommand([key, value]).exec(client);
    const res = await new SIsMemberCommand([key, value]).exec(client);
    expect(res).toEqual(1);
  });
});

describe("when member exists", () => {
  test("returns 0", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new SAddCommand([key, value1]).exec(client);
    const res = await new SIsMemberCommand([key, value2]).exec(client);
    expect(res).toEqual(0);
  });
});
