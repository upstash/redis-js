import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { LPushCommand } from "./lpush.ts";
import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { LMoveCommand } from "./lmove.ts";
import { LPopCommand } from "./lpop.ts";
import { LLenCommand } from "./llen.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test("moves the entry from left to left", async () => {
  const source = newKey();
  const destination = newKey();
  const value = randomID();
  await new LPushCommand([source, value]).exec(
    client,
  );

  const res = await new LMoveCommand([source, destination, "left", "left"])
    .exec(client);
  assertEquals(res, value);

  const elementInSource = await new LPopCommand([source]).exec(client);
  assertEquals(elementInSource, null);

  const elementInDestination = await new LPopCommand([destination]).exec(
    client,
  );
  assertEquals(elementInDestination, value);
});

Deno.test("moves the entry from left to right", async () => {
  const source = newKey();
  const destination = newKey();
  const values = new Array(5).fill(0).map((_) => randomID());

  await new LPushCommand([source, ...values]).exec(
    client,
  );

  const res = await new LMoveCommand([source, destination, "left", "right"])
    .exec(client);
  assertEquals(res, values.at(-1));

  const elementsInSource = await new LLenCommand([source]).exec(client);
  assertEquals(elementsInSource, values.length - 1);

  const elementInDestination = await new LPopCommand([destination]).exec(
    client,
  );
  assertEquals(elementInDestination, values.at(-1));
});
