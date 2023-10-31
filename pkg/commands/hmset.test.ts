import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { HMGetCommand } from "./hmget";
import { HMSetCommand } from "./hmset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("gets exiting values", async () => {
  const key = newKey();
  const kv = {
    [randomID()]: randomID(),
    [randomID()]: randomID(),
  };
  const res = await new HMSetCommand([key, kv]).exec(client);

  expect(res).toEqual("OK");
  const res2 = await new HMGetCommand([key, ...Object.keys(kv)]).exec(client);

  expect(res2).toEqual(kv);
});
