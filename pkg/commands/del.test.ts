import { keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { DelCommand } from "./del";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when key does not exist", () => {
  test("does nothing", async () => {
    const key = newKey();

    const res = await new DelCommand([key]).exec(client);
    expect(res).toEqual(0);
  });
});
describe("when key does exist", () => {
  test("deletes the key", async () => {
    const key = newKey();
    await new SetCommand([key, "value"]).exec(client);
    const res = await new DelCommand([key]).exec(client);
    expect(res).toEqual(1);
  });
});
describe("with multiple keys", () => {
  describe("when one does not exist", () => {
    test("deletes all keys", async () => {
      const key1 = newKey();
      const key2 = newKey();
      await new SetCommand([key1, "value"]).exec(client);
      const res = await new DelCommand([key1, key2]).exec(client);
      expect(res).toEqual(1);
    });
  });
});
