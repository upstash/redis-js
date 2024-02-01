import { keygen, newHttpClient } from "../test-utils";

import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { XAddCommand } from "./xadd";
import { XRevRangeCommand } from "./xrevrange";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
const key = newKey();
afterAll(cleanup);

beforeEach(async () => {
  await new XAddCommand([key, "*", { name: "Virginia", surname: "Woolf" }]).exec(client);

  await new XAddCommand([key, "*", { name: "Jane", surname: "Austen" }]).exec(client);

  await new XAddCommand([key, "*", { name: "Toni", surname: "Morrison" }]).exec(client);

  await new XAddCommand([key, "*", { name: "Agatha", surname: "Christie" }]).exec(client);

  await new XAddCommand([key, "*", { name: "Ngozi", surname: "Adichie" }]).exec(client);
});

describe("without options", () => {
  test("should return stream in a reverse order", async () => {
    const res = await new XRevRangeCommand([key, "+", "-"]).exec(client);

    expect(Object.keys(res).length).toBe(5);
    expect(Object.values(res)[0]).toEqual({
      name: "Ngozi",
      surname: "Adichie",
    });
  });
});

describe("LIMIT", () => {
  test("should return only last two", async () => {
    const res = await new XRevRangeCommand([key, "+", "-", 2]).exec(client);
    expect(Object.keys(res).length).toBe(2);
    expect(Object.values(res)).toEqual([
      {
        name: "Ngozi",
        surname: "Adichie",
      },
      { name: "Agatha", surname: "Christie" },
    ]);
  });
});
