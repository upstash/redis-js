import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { MGetCommand } from "./mget";
import { MSetCommand } from "./mset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("gets exiting values", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const kv = {
    [key1]: randomID(),
    [key2]: randomID(),
  };
  const res = await new MSetCommand([kv]).exec(client);

  expect(res).toEqual("OK");
  const res2 = await new MGetCommand([key1, key2]).exec(client);
  expect(res2).toEqual(Object.values(kv));
});
