import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { HDelCommand } from "./hdel.ts";
import { HSetCommand } from "./hset.ts";
import { HGetCommand } from "./hget.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "deletes a hash that does not exist",
  async () => {
    const key = newKey();
    const field = randomID();
    const res = await new HDelCommand([key, field]).exec(client);

    assertEquals(res, 0);
  },
);

Deno.test(
  "deletes a field that exists",
  async () => {
    const key = newKey();
    const field = randomID();
    await new HSetCommand([key, { [field]: randomID() }]).exec(
      client,
    );
    const res = await new HDelCommand([key, field]).exec(client);

    assertEquals(res, 1);
    const res2 = await new HGetCommand([key, field]).exec(client);

    assertEquals(res2, null);
  },
);

Deno.test(
  "deletes multiple fields",
  async () => {
    const key = newKey();
    const field1 = randomID();
    const field2 = randomID();
    await new HSetCommand([key, { [field1]: randomID(), [field2]: randomID() }])
      .exec(
        client,
      );
    const res = await new HDelCommand([key, field1, field2]).exec(client);

    assertEquals(res, 2);
    const res2 = await new HGetCommand([key, field1]).exec(client);
    assertEquals(res2, null);

    const res3 = await new HGetCommand([key, field2]).exec(client);
    assertEquals(res3, null);
  },
);
