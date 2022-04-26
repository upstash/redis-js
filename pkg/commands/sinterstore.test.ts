import { keygen, newHttpClient } from "../test-utils.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SInterStoreCommand } from "./sinterstore.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "stores the intersection",
  async () => {
    const key1 = newKey();
    const member1 = crypto.randomUUID();
    const key2 = newKey();
    const member2 = member1;
    const destination = newKey();
    await new SAddCommand(key1, member1).exec(client);
    await new SAddCommand(key2, member2).exec(client);
    const res = await new SInterStoreCommand(destination, key1, key2).exec(
      client,
    );
    assertEquals(res, 1);
  },
);
