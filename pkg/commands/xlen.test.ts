import { keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XAddCommand } from "./xadd";
import { XLenCommand } from "./xlen";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XLEN", () => {
  test("should give size of the stream", async () => {
    const key = newKey();
    await new XAddCommand([key, "*", { name: "Jane", surname: "Austen" }]).exec(
      client
    );
    await new XAddCommand([
      key,
      "*",
      { name: "Toni", surname: "Morrison" },
    ]).exec(client);

    await new XAddCommand([
      key,
      "*",
      { name: "Hezarfen", surname: "----" },
    ]).exec(client);

    const res = await new XLenCommand([key]).exec(client);

    expect(res).toBe(3);
  });

  test("should return 0 when specified key does not exist", async () => {
    const res = await new XLenCommand(["missing-key"]).exec(client);
    expect(res).toBe(0);
  });
});
