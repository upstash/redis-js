import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { Pipeline } from "../pipeline";
import { XAddCommand } from "./xadd";
import { XLenCommand } from "./xlen";
import { XTrimCommand } from "./xtrim";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XLEN", () => {
  test(
    "should approximately trim stream to 30 items",
    async () => {
      const key = newKey();
      const promises = [];
      for (let i = 1; i <= 1000; i++) {
        promises.push(new XAddCommand([key, "*", { [randomID()]: randomID() }]).exec(client));
      }
      await Promise.all(promises);
      await new XTrimCommand([key, { strategy: "MAXLEN", threshold: 30, exactness: "~" }]).exec(
        client
      );
      const len = await new XLenCommand([key]).exec(client);
      // an approximate trim can leave up to 100 entries more than the threshold
      expect(len).toBeGreaterThanOrEqual(30);
      expect(len).toBeLessThanOrEqual(130);
    },
    { timeout: 1000 * 60 }
  );

  test(
    "should trim stream to exactly 30 items",
    async () => {
      const key = newKey();
      const promises = [];
      for (let i = 1; i <= 1000; i++) {
        promises.push(new XAddCommand([key, "*", { [randomID()]: randomID() }]).exec(client));
      }
      await Promise.all(promises);
      await new XTrimCommand([key, { strategy: "MAXLEN", threshold: 30, exactness: "=" }]).exec(
        client
      );
      const len = await new XLenCommand([key]).exec(client);
      expect(len).toBe(30);
    },
    { timeout: 1000 * 60 }
  );

  test("should trim with zero threshold and remove everything", async () => {
    const key = newKey();
    const promises = [];
    for (let i = 1; i <= 50; i++) {
      promises.push(new XAddCommand([key, "*", { [randomID()]: randomID() }]).exec(client));
    }
    await Promise.all(promises);
    await new XTrimCommand([key, { strategy: "MAXLEN", threshold: 0, exactness: "=" }]).exec(
      client
    );
    const len = await new XLenCommand([key]).exec(client);
    expect(len).toBeLessThanOrEqual(1);
  });

  test(
    "should trim with MINID and a limit and only remove 2 items that satisfies MINID",
    async () => {
      const key = newKey();
      const baseTimestamp = Date.now();
      for (let i = 0; i < 20; i++) {
        const id = `${baseTimestamp}-${i}`;
        await new XAddCommand([key, id, { data: `value${i}` }]).exec(client);
      }
      const midRangeId = `${baseTimestamp}-10`;
      await new XTrimCommand([key, { strategy: "MINID", threshold: midRangeId, limit: 2 }]).exec(
        client
      );
      const len = await new XLenCommand([key]).exec(client);
      expect(len).toBeLessThanOrEqual(20);
    },
    { timeout: 20_000 }
  );

  test(
    "should send LIMIT 0 and trim past the default limit",
    async () => {
      const key = newKey();
      for (let batch = 0; batch < 3; batch++) {
        const pipeline = new Pipeline({ client });
        for (let i = 0; i < 4000; i++) {
          pipeline.xadd(key, "*", { data: i });
        }
        await pipeline.exec();
      }
      // without LIMIT, an approximate trim evicts at most 10000 entries per call
      const deleted = await new XTrimCommand([
        key,
        { strategy: "MAXLEN", threshold: 0, exactness: "~", limit: 0 },
      ]).exec(client);
      expect(deleted).toBe(12_000);
      expect(await new XLenCommand([key]).exec(client)).toBe(0);
    },
    { timeout: 1000 * 60 }
  );
});
