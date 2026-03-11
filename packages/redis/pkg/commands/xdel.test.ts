import { keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XAddCommand } from "./xadd";
import { XDelCommand } from "./xdel";
import { XRangeCommand } from "./xrange";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XDEL", () => {
  test("should delete one item from the stream", async () => {
    const key = newKey();
    await new XAddCommand([key, "*", { name: "Jane", surname: "Austen" }]).exec(client);

    const res = await new XAddCommand([key, "*", { name: "Toni", surname: "Morrison" }]).exec(
      client
    );

    const xdelRes = await new XDelCommand([key, res]).exec(client);
    const xrangeRes = await new XRangeCommand([key, "-", "+", 1]).exec(client);

    expect(Object.keys(xrangeRes).length).toBe(1);
    expect(xdelRes).toBe(1);
  });

  test("should delete multiple items from the stream", async () => {
    const key = newKey();

    const id1 = await new XAddCommand([key, "*", { name: "Jane", surname: "Austen" }]).exec(client);

    const id2 = await new XAddCommand([key, "*", { name: "Toni", surname: "Morrison" }]).exec(
      client
    );

    const id3 = await new XAddCommand([key, "*", { name: "Agatha", surname: "Christie" }]).exec(
      client
    );

    await new XAddCommand([key, "*", { name: "Ngozi", surname: "Adichie" }]).exec(client);

    const xdelRes = await new XDelCommand([key, [id1, id2, id3]]).exec(client);
    const xrangeRes = await new XRangeCommand([key, "-", "+", 1]).exec(client);

    expect(Object.keys(xrangeRes).length).toBe(1);
    expect(xdelRes).toBe(3);
  });
});
