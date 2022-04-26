import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { ExpireCommand } from "./expire.ts";
import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("expires a key correctly", async () => {
  const key = newKey();
  const value = Math.random().toString();
  await new SetCommand(key, value).exec(client);
  const res = await new ExpireCommand(key, 1).exec(client);
  assertEquals(res, 1);
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new GetCommand(key).exec(client);

  assertEquals(res2, null);
});
