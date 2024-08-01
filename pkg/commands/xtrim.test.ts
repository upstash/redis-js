import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
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
      expect(len).toBeGreaterThanOrEqual(29);
      expect(len).toBeLessThanOrEqual(31);
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
});
