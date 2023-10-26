import { afterAll, expect, test } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";

import { HScanCommand } from "./hscan";
import { HSetCommand } from "./hset";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
test("without options", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    await new HSetCommand([key, { field: "value" }]).exec(client);
    const res = await new HScanCommand([key, 0]).exec(client);

    expect(res.length, 2);
    expect(typeof res[0], "number");
    expect(res![1].length > 0, true);
  });
});

test("with match", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    await new HSetCommand([key, { field: "value" }]).exec(client);
    const res = await new HScanCommand([key, 0, { match: "field" }]).exec(client);

    expect(res.length, 2);
    expect(typeof res[0], "number");
    expect(res![1].length > 0, true);
  });
});

test("with count", () => {
  test("returns cursor and members", async () => {
    const key = newKey();
    await new HSetCommand([key, { field: "value" }]).exec(client);
    const res = await new HScanCommand([key, 0, { count: 1 }]).exec(client);

    expect(res.length, 2);
    expect(typeof res[0], "number");
    expect(res![1].length > 0, true);
  });
});
