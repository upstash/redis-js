import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { LIndexCommand } from "./lindex";
import { LPushCommand } from "./lpush";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when list exists", () => {
  describe("when the index is in range", () => {
    test("returns the element at index", async () => {
      const key = newKey();

      const value = randomID();
      await new LPushCommand([key, value]).exec(client);
      const res = await new LIndexCommand([key, 0]).exec(client);
      expect(res).toEqual(value);
    });
    describe("when the index is out of bounds", () => {
      test("returns null", async () => {
        const key = newKey();

        const value = randomID();
        await new LPushCommand([key, value]).exec(client);
        const res = await new LIndexCommand([key, 1]).exec(client);
        expect(res).toEqual(null);
      });
    });
  });
});
