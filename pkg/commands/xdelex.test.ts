import { keygen, newHttpClient } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { XDelExCommand } from "./xdelex";
import { XAddCommand } from "./xadd";
import { XRangeCommand } from "./xrange";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XDELEX command", () => {
  test("deletes single entry with default KEEPREF option", async () => {
    const key = newKey();

    const id1 = await new XAddCommand([key, "*", { field1: "value1" }]).exec(client);
    const id2 = await new XAddCommand([key, "*", { field2: "value2" }]).exec(client);

    const res = await new XDelExCommand([key, undefined, id1 as string]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(1);

    const remaining = await new XRangeCommand([key, "-", "+"]).exec(client);
    expect(Array.isArray(remaining) ? remaining.length : Object.keys(remaining).length).toEqual(1);
    const remainingArray = Array.isArray(remaining) ? remaining : Object.entries(remaining);
    expect(remainingArray[0][0]).toEqual(id2);
  });

  test("deletes multiple entries", async () => {
    const key = newKey();

    const id1 = await new XAddCommand([key, "*", { field1: "value1" }]).exec(client);
    const id2 = await new XAddCommand([key, "*", { field2: "value2" }]).exec(client);
    const id3 = await new XAddCommand([key, "*", { field3: "value3" }]).exec(client);

    const res = await new XDelExCommand([key, undefined, id1 as string, id2 as string]).exec(
      client
    );

    expect(res).toHaveLength(2);
    expect(res[0]).toEqual(1);
    expect(res[1]).toEqual(1);

    const remaining = await new XRangeCommand([key, "-", "+"]).exec(client);
    expect(Array.isArray(remaining) ? remaining.length : Object.keys(remaining).length).toEqual(1);
    const remainingArray = Array.isArray(remaining) ? remaining : Object.entries(remaining);
    expect(remainingArray[0][0]).toEqual(id3);
  });

  test("returns -1 for non-existent entry IDs", async () => {
    const key = newKey();

    await new XAddCommand([key, "*", { field1: "value1" }]).exec(client);

    const res = await new XDelExCommand([key, undefined, "9999999999999-0"]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(-1);
  });

  test("uses KEEPREF option explicitly", async () => {
    const key = newKey();

    const id1 = await new XAddCommand([key, "*", { field1: "value1" }]).exec(client);

    const res = await new XDelExCommand([key, "KEEPREF", id1 as string]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(1);
  });

  test("uses DELREF option", async () => {
    const key = newKey();

    const id1 = await new XAddCommand([key, "*", { field1: "value1" }]).exec(client);

    const res = await new XDelExCommand([key, "DELREF", id1 as string]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(1);
  });

  test("accepts lowercase option", async () => {
    const key = newKey();

    const id1 = await new XAddCommand([key, "*", { field1: "value1" }]).exec(client);

    const res = await new XDelExCommand([key, "keepref", id1 as string]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(1);
  });

  test("command structure is correct", () => {
    const cmd = new XDelExCommand(["mystream", "DELREF", "1234-0", "1235-0"]);
    expect(cmd.command).toEqual(["XDELEX", "mystream", "DELREF", "IDS", 2, "1234-0", "1235-0"]);
  });

  test("command structure without option", () => {
    const cmd = new XDelExCommand(["mystream", undefined, "1234-0"]);
    expect(cmd.command).toEqual(["XDELEX", "mystream", "IDS", 1, "1234-0"]);
  });
});
