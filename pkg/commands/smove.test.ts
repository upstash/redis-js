import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { afterAll, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SMoveCommand } from "./smove.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "moves the member",
  async () => {
    const source = newKey();
    const destination = newKey();
    const member = crypto.randomUUID();
    await new SAddCommand(source, member).exec(client);
    const res = await new SMoveCommand(source, destination, member).exec(
      client,
    );
    assertEquals(res, 1);
  },
);
