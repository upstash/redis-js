import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { MSetCommand } from "./mset";
import { TouchCommand } from "./touch";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the number of touched keys", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const kv: Record<string, string> = {};
  kv[key1] = randomID();
  kv[key2] = randomID();
  await new MSetCommand([kv]).exec(client);
  const res = await new TouchCommand([key1, key2]).exec(client);
  expect(res).toEqual(2);
});
