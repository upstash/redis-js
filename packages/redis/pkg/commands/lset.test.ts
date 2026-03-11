import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { LPopCommand } from "./lpop";
import { LPushCommand } from "./lpush";
import { LSetCommand } from "./lset";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  describe("when the index is in range", () => {
    test("replaces the element at index", async () => {
      const key = newKey();

      const value = randomID();
      const newValue = randomID();
      await new LPushCommand([key, value]).exec(client);
      const res = await new LSetCommand([key, 0, newValue]).exec(client);
      expect(res).toEqual("OK");

      const res2 = await new LPopCommand([key]).exec(client);

      expect(res2).toEqual(newValue);
    });
    describe("when the index is out of bounds", () => {
      test("returns null", async () => {
        const key = newKey();

        const value = randomID();
        const newValue = randomID();
        await new LPushCommand([key, value]).exec(client);
        let hasThrown = false;
        await new LSetCommand([key, 1, newValue]).exec(client).catch(() => {
          hasThrown = true;
        });
        expect(hasThrown).toBeTrue();
      });
    });
  });
});
