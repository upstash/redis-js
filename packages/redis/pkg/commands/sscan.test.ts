import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { SAddCommand } from "./sadd";
import { SScanCommand } from "./sscan";
const client = newHttpClient();

const { newKey, cleanup } = keygen();

afterAll(cleanup);
describe("without options", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, 0]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});

describe("with match", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, "0", { match: member }]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});

describe("with empty match", () => {
  test("returns only the empty member", async () => {
    const key = newKey();
    await new SAddCommand([key, "", randomID()]).exec(client);
    const res = await new SScanCommand([key, "0", { match: "" }]).exec(client);

    expect(res[1]).toEqual([""]);
  });
});

describe("with count", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SScanCommand([key, "0", { count: 1 }]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});
