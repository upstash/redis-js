import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { LPushCommand } from "./lpush";
import { LTrimCommand } from "./ltrim";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when the list exists", () => {
  test("returns ok", async () => {
    const key = newKey();
    await new LPushCommand([key, randomID()]).exec(client);
    await new LPushCommand([key, randomID()]).exec(client);
    await new LPushCommand([key, randomID()]).exec(client);
    const res = await new LTrimCommand([key, 1, 2]).exec(client);
    expect(res).toEqual("OK");
  });
});

describe("when the list does not exist", () => {
  test("returns ok", async () => {
    const key = newKey();

    const res = await new LTrimCommand([key, 1, 2]).exec(client);
    expect(res).toEqual("OK");
  });
});
