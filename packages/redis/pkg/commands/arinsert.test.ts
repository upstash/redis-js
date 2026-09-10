import { keygen, newHttpClient } from "../test-utils";
import { afterAll, describe, expect, test } from "bun:test";
import { ArDelCommand } from "./ardel";
import { ArGetRangeCommand } from "./argetrange";
import { ArInsertCommand } from "./arinsert";
import { ArNextCommand } from "./arnext";
import { ArSeekCommand } from "./arseek";

const client = newHttpClient();
const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("ARINSERT / ARNEXT / ARSEEK", () => {
  test("appends and returns the index of the last value", async () => {
    const key = newKey();
    expect(await new ArNextCommand([key]).exec(client)).toBe(0);
    expect(await new ArInsertCommand([key, "a", "b"]).exec(client)).toBe(1);
    expect(await new ArInsertCommand([key, "c"]).exec(client)).toBe(2);
    expect(await new ArNextCommand([key]).exec(client)).toBe(3);
    expect(await new ArGetRangeCommand([key, 0, 2]).exec(client)).toEqual(["a", "b", "c"]);
  });

  test("deleting does not rewind the cursor", async () => {
    const key = newKey();
    await new ArInsertCommand([key, "a", "b"]).exec(client);
    await new ArDelCommand([key, 1]).exec(client);
    expect(await new ArInsertCommand([key, "c"]).exec(client)).toBe(2);
  });

  test("arseek moves the cursor", async () => {
    const key = newKey();
    await new ArInsertCommand([key, "a", "b", "c"]).exec(client);
    expect(await new ArSeekCommand([key, 10]).exec(client)).toBe(1);
    expect(await new ArNextCommand([key]).exec(client)).toBe(10);
    expect(await new ArInsertCommand([key, "z"]).exec(client)).toBe(10);
  });

  test("arseek on a missing key returns 0", async () => {
    expect(await new ArSeekCommand([newKey(), 5]).exec(client)).toBe(0);
  });
});
