import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { SetCommand } from "./set";

import { ExpireAtCommand } from "./expireat";
import { GetCommand } from "./get";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("expires the key", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    const res = await new ExpireAtCommand([key, 1]).exec(client);
    expect(res).toEqual(1);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new GetCommand([key]).exec(client);
    expect(res2).toEqual(null);
  });
});
