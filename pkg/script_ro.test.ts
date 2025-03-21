import { afterEach, describe, expect, test } from "bun:test";
import { Redis } from "./redis";
import { keygen, newHttpClient, randomID } from "./test-utils";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("create a new readonly script", () => {
  test(
    "creates a new readonly script",
    async () => {
      const redis = new Redis(client);
      const value = randomID();
      const key = newKey();
      await redis.set(key, value);
      const script = redis.createScript("return redis.call('GET', KEYS[1]);", { readOnly: true });

      const res = await script.eval_ro([key], []);
      expect(res).toEqual(value);
    },
    { timeout: 15_000 }
  );

  test(
    "throws when write commands are used",
    async () => {
      const redis = new Redis(client);
      const value = randomID();
      const key = newKey();
      await redis.set(key, value);
      const script = redis.createScript("return redis.call('DEL', KEYS[1]);", { readOnly: true });

      expect(async () => {
        await script.eval_ro([key], []);
      }).toThrow();
    },
    { timeout: 15_000 }
  );
});
