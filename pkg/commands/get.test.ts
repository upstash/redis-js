import { keygen, newHttpClient, randomID } from "../test-utils.ts";

import { afterAll } from "https://deno.land/std@0.177.0/testing/bdd.ts";
import { SetCommand } from "./set.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { GetCommand } from "./get.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

Deno.test(
  "gets an exiting value",
  async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new GetCommand([key]).exec(client);

    assertEquals(res, value);
  },
);

Deno.test(
  "gets a non-existing value",
  async () => {
    const key = newKey();
    const res = await new GetCommand([key]).exec(client);

    assertEquals(res, null);
  },
);

Deno.test(
  "gets an object",
  async () => {
    const key = newKey();
    const value = { v: randomID() };
    await new SetCommand([key, value]).exec(client);
    const res = await new GetCommand<{ v: string }>([key]).exec(client);

    assertEquals(res, value);
  },
);
