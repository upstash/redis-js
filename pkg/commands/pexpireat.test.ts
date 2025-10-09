import { keygen, newHttpClient, randomID } from "../test-utils";
import { GetCommand } from "./get";
import { PExpireAtCommand } from "./pexpireat";

import { afterAll, expect, test, describe } from "bun:test";
import { SetCommand } from "./set";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("expires the key", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
  });
});
describe("without options", () => {
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
test("doesn't set the expiration if the second pexpire command timestamp is smaller", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);

  const expireAtMillisecond = Date.now() + 60_000;

  const res = await new PExpireAtCommand([key, expireAtMillisecond]).exec(client);
  expect(res).toEqual(1);

  const res2 = await new PExpireAtCommand([key, expireAtMillisecond - 1000, "GT"]).exec(client);
  expect(res2).toEqual(0);
});
