import { Redis } from "./redis.ts";
import { keygen, newHttpClient } from "./test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  afterEach,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("when destructuring the redis class", () => {
  it("correctly binds this", async () => {
    const { get, set } = new Redis(client);
    const key = newKey();
    const value = crypto.randomUUID();
    await set(key, value);
    const res = await get(key);
    assertEquals(res, value);
  });
});

describe("zadd", () => {
  it("adds the set", async () => {
    const key = newKey();
    const score = 1;
    const member = crypto.randomUUID();

    const res = await new Redis(client).zadd(key, { score, member });
    assertEquals(res, 1);
  });
});

describe("zrange", () => {
  it("returns the range", async () => {
    const key = newKey();
    const score = 1;
    const member = crypto.randomUUID();
    const redis = new Redis(client);
    await redis.zadd(key, { score, member });
    const res = await redis.zrange(key, 0, 2);
    assertEquals(res, [member]);
  });
});
