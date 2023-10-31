import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SScanCommand } from "./sscan";
const client = newHttpClient();

const { newKey, cleanup } = keygen();

afterAll(cleanup);
test("without options", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, 0]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("number");
    expect(res![1].length > 0).toBe(true);
  });
});

test("with match", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, 0, { match: member }]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("number");
    expect(res![1].length > 0).toBe(true);
  });
});

test("with count", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, 0, { count: 1 }]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("number");
    expect(res![1].length > 0).toBe(true);
  });
});
