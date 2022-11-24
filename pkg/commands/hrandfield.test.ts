import { keygen, newHttpClient, randomID } from "../test-utils.ts";
import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { afterAll } from "https://deno.land/std@0.152.0/testing/bdd.ts";
import { HSetCommand } from "./hset.ts";
import { HRandFieldCommand } from "./hrandfield.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
Deno.test("with single field present", async (t) => {
  await t.step("returns the field", async () => {
    const key = newKey();
    const field1 = randomID();
    const value1 = randomID();
    await new HSetCommand([key, { [field1]: value1 }]).exec(
      client,
    );

    const res = await new HRandFieldCommand([key]).exec(client);

    assertEquals(res, field1);
  });
});

Deno.test("with multiple fields present", async (t) => {
  await t.step("returns a random field", async () => {
    const key = newKey();
    const fields: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      fields[randomID()] = randomID();
    }
    await new HSetCommand([key, fields]).exec(
      client,
    );

    const res = await new HRandFieldCommand<string>([key]).exec(client);

    assert(res in fields);
  });
});

Deno.test("with withvalues", async (t) => {
  await t.step("returns a subset with values", async () => {
    const key = newKey();
    const fields: Record<string, string> = {};
    for (let i = 0; i < 10; i++) {
      fields[randomID()] = randomID();
    }
    await new HSetCommand([key, fields]).exec(
      client,
    );

    const res = await new HRandFieldCommand<Record<string, string>>([
      key,
      2,
      true,
    ]).exec(client);
    for (const [k, v] of Object.entries(res)) {
      assert(k in fields);
      assert(fields[k] === v);
    }
  });
});
Deno.test("when hash does not exist", async (t) => {
  await t.step("it returns null", async () => {
    const res = await new HRandFieldCommand([randomID()]).exec(client);
    assertEquals(res, null);
  });
});
