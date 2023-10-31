import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XAddCommand } from "./xadd";
import { XRangeCommand } from "./xrange";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without options", () => {
  test("returns the set", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    await new XAddCommand([key, "*", { [field1]: member1, [field2]: member2 }]).exec(client);

    const res = await new XRangeCommand([key, "-", "+"]).exec(client);
    expect(Object.keys(res).length).toBe(1);
    expect(Object.values(res)[0]).toEqual({
      [field1]: member1,
      [field2]: member2,
    });
  });
});

describe("limit", () => {
  test("returns the only the first one", async () => {
    const key = newKey();
    const field1 = "field1";
    const member1 = randomID();

    const field2 = "field2";
    const member2 = randomID();

    await new XAddCommand([key, "*", { [field1]: member1 }]).exec(client);
    await new XAddCommand([key, "*", { [field2]: member2 }]).exec(client);

    const res = await new XRangeCommand([key, "-", "+", 1]).exec(client);
    expect(Object.keys(res).length).toBe(1);
    expect(Object.values(res)[0]).toEqual({
      [field1]: member1,
    });
  });
});

test("many fields", () => {
  test("returns all fields", async () => {
    const key = newKey();

    const fields: Record<string, string> = {};

    for (let i = 1; i <= 10; i++) {
      const field = randomID();
      const value = randomID();
      fields[field] = value;
      const id = await new XAddCommand([key, "*", fields]).exec(client);

      const res = await new XRangeCommand([key, "-", "+"]).exec(client);
      expect(Object.keys(res).length).toBe(i);
      expect(res[id]).toEqual(fields);
    }
  });
});
