import { keygen, newHttpClient, randomID } from "../test-utils";
import { GetCommand } from "./get";
import { PExpireAtCommand } from "./pexpireat";

import { afterAll, expect, test } from "bun:test";
import { SetCommand } from "./set";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("without options", () => {
  test("expires the key", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
  });
});
test("without options", () => {
  test("expires the key", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);

    const res = await new PExpireAtCommand([key, 1000]).exec(client);
    expect(res).toEqual(1);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new GetCommand([key]).exec(client);
    expect(res2).toEqual(null);
  });
});
