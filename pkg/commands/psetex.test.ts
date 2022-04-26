import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { PSetEXCommand } from "./psetex.ts";
import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it("sets value", async () => {
  const key = newKey();
  const value = Math.random().toString();

  const res = await new PSetEXCommand(key, 1000, value).exec(client);

  assertEquals(res, "OK");
  await new Promise((res) => setTimeout(res, 2000));
  const res2 = await new GetCommand(key).exec(client);

  assertEquals(res2, null);
});
