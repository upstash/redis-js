import { keygen, newHttpClient } from "../test-utils.ts";

import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { SAddCommand } from "./sadd.ts";
import { SPopCommand } from "./spop.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without count", () => {
  it("returns the first element", async () => {
    const key = newKey();
    const member = crypto.randomUUID();
    await new SAddCommand(key, member).exec(client);
    const res = await new SPopCommand(key).exec(client);
    assertEquals(res, member);
  });
});

describe("with count", () => {
  it("returns the first n elements", async () => {
    const key = newKey();
    const member1 = crypto.randomUUID();
    const member2 = crypto.randomUUID();
    const member3 = crypto.randomUUID();
    const member4 = crypto.randomUUID();
    await new SAddCommand(key, member1, member2, member3, member4).exec(client);
    const res = await new SPopCommand<string[]>(key, 2).exec(client);

    assertEquals(res?.length, 2);
    assertEquals([member1, member2, member3, member4].includes(res![0]), true);
    assertEquals([member1, member2, member3, member4].includes(res![1]), true);
  });
});
