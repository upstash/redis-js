import { afterAll, describe, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { HScanCommand } from "./hscan";
import { HSetCommand } from "./hset";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
describe("without options", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    await new HSetCommand([key, { field: "value" }]).exec(client);
    const res = await new HScanCommand([key, 0]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});

describe("with match", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    await new HSetCommand([key, { field: "value" }]).exec(client);
    const res = await new HScanCommand([key, "0", { match: "field" }]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});

describe("with empty match", () => {
  test("returns only the field with an empty name", async () => {
    const key = newKey();
    await new HSetCommand([key, { "": "empty", field: "value" }]).exec(client);
    const res = await new HScanCommand([key, "0", { match: "" }]).exec(client);

    expect(res[1]).toEqual(["", "empty"]);
  });
});

describe("with count", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    await new HSetCommand([key, { field: "value" }]).exec(client);
    const res = await new HScanCommand([key, "0", { count: 1 }]).exec(client);

    expect(res.length).toBe(2);
    expect(typeof res[0]).toBe("string");
    expect(res[1].length > 0).toBe(true);
  });
});
