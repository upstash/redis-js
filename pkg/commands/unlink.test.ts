import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { MSetCommand } from "./mset";
import { UnlinkCommand } from "./unlink";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("unlinks the keys", async () => {
  const key1 = newKey();
  const key2 = newKey();
  const key3 = newKey();
  const kv: Record<string, string> = {};
  kv[key1] = randomID();
  kv[key2] = randomID();
  await new MSetCommand([kv]).exec(client);
  const res = await new UnlinkCommand([key1, key2, key3]).exec(client);
  expect(res).toEqual(2);
});
