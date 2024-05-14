import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";

import { LmPopCommand } from "./lmpop";
import { LPushCommand } from "./lpush";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("LMPOP", () => {
  test("should pop elements from the left-most end of the list", async () => {
    const key = newKey();
    const lpushElement1 = { name: randomID(), surname: randomID() };
    const lpushElement2 = { name: randomID(), surname: randomID() };

    await new LPushCommand([key, lpushElement1, lpushElement2]).exec(client);

    const result = await new LmPopCommand<{ name: string; surname: string }>([
      1,
      [key],
      "LEFT",
      2,
    ]).exec(client);

    expect(result?.[1][0].name).toEqual(lpushElement2.name);
  });

  test("should pop elements from the right-most end of the list", async () => {
    const key = newKey();
    const lpushElement1 = randomID();
    const lpushElement2 = randomID();

    await new LPushCommand([key, lpushElement1, lpushElement2]).exec(client);

    const result = await new LmPopCommand<string>([1, [key], "RIGHT", 2]).exec(client);

    expect(result?.[1][0]).toEqual(lpushElement1);
  });

  test("should pop elements from the first list then second list", async () => {
    const key = newKey();
    const lpushElement1 = randomID();
    const lpushElement2 = randomID();

    const key2 = newKey();
    const lpushElement2_1 = randomID();
    const lpushElement2_2 = randomID();

    await new LPushCommand([key, lpushElement1, lpushElement2]).exec(client);
    await new LPushCommand([key2, lpushElement2_1, lpushElement2_2]).exec(client);

    const result = await new LmPopCommand<string>([2, [key, key2], "RIGHT", 4]).exec(client);
    expect(result).toEqual([key, [lpushElement1, lpushElement2]]);

    const result1 = await new LmPopCommand<string>([2, [key, key2], "RIGHT", 4]).exec(client);
    expect(result1).toEqual([key2, [lpushElement2_1, lpushElement2_2]]);
  });

  test("should return null after first attempt", async () => {
    const key = newKey();
    const lpushElement1 = randomID();
    const lpushElement2 = randomID();

    await new LPushCommand([key, lpushElement1, lpushElement2]).exec(client);

    await new LmPopCommand([1, [key], "LEFT", 2]).exec(client);

    const result1 = await new LmPopCommand([1, [key], "LEFT", 2]).exec(client);

    expect(result1).toBeNull();
  });

  test("should return without count", async () => {
    const key = newKey();
    const lpushElement1 = randomID();
    const lpushElement2 = randomID();

    await new LPushCommand([key, lpushElement1, lpushElement2]).exec(client);

    const result1 = await new LmPopCommand([1, [key], "LEFT"]).exec(client);

    expect(result1).toEqual([key, [lpushElement2]]);
  });
});
