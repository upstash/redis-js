import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { XAckDelCommand } from "./xackdel";
import { XAddCommand } from "./xadd";
import { XGroupCommand } from "./xgroup";
import { XReadGroupCommand } from "./xreadgroup";
import { XPendingCommand } from "./xpending";
import { XRangeCommand } from "./xrange";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XACKDEL command", () => {
  test("acknowledges and deletes entries with KEEPREF", async () => {
    const key = newKey();
    const group = randomID();
    const consumer = randomID();

    const id1 = await new XAddCommand([key, "*", { field1: "value1" }]).exec(client);
    const id2 = await new XAddCommand([key, "*", { field2: "value2" }]).exec(client);

    await new XGroupCommand([key, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer, key, ">"]).exec(client);

    const res = await new XAckDelCommand([
      key,
      group,
      "KEEPREF",
      id1,
      id2,
    ]).exec(client);

    expect(res).toHaveLength(2);
    expect(res[0]).toEqual(1);
    expect(res[1]).toEqual(1);

    const remaining = await new XRangeCommand([key, "-", "+"]).exec(client);
    expect(Array.isArray(remaining) ? remaining.length : 0).toEqual(0);

    const pending = await new XPendingCommand([key, group, "-", "+", 10]).exec(client);
    expect(pending).toHaveLength(0); // No pending entries
  });

  test("acknowledges and deletes single entry", async () => {
    const key = newKey();
    const group = randomID();
    const consumer = randomID();

    const id = await new XAddCommand([key, "*", { field: "value" }]).exec(client);

    await new XGroupCommand([key, { type: "CREATE", group, id: "0" }]).exec(client);
    await new XReadGroupCommand([group, consumer, key, ">"]).exec(client);

    const res = await new XAckDelCommand([key, group, "DELREF", id]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(1);
  });

  test("returns -1 for non-existent entry IDs", async () => {
    const key = newKey();
    const group = randomID();

    await new XAddCommand([key, "*", { field: "value" }]).exec(client);
    await new XGroupCommand([key, { type: "CREATE", group, id: "0" }]).exec(client);

    const res = await new XAckDelCommand([key, group, "DELREF", "9999999999999-0"]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(-1);
  });

  test("uses DELREF option", async () => {
    const key = newKey();
    const group = randomID();
    const consumer = randomID();

    const id = await new XAddCommand([key, "*", { field: "value" }]).exec(client);

    await new XGroupCommand([key, { type: "CREATE", group, id: "0" }]).exec(client);
    await new XReadGroupCommand([group, consumer, key, ">"]).exec(client);

    const res = await new XAckDelCommand([key, group, "DELREF", id]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(1);
  });

  test("accepts lowercase option", async () => {
    const key = newKey();
    const group = randomID();
    const consumer = randomID();

    const id = await new XAddCommand([key, "*", { field: "value" }]).exec(client);

    await new XGroupCommand([key, { type: "CREATE", group, id: "0" }]).exec(client);
    await new XReadGroupCommand([group, consumer, key, ">"]).exec(client);

    const res = await new XAckDelCommand([key, group, "keepref", id]).exec(client);

    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(1);
  });

  test("command structure is correct", () => {
    const cmd = new XAckDelCommand(["mystream", "mygroup", "DELREF", "1234-0", "1235-0"]);
    expect(cmd.command).toEqual([
      "XACKDEL",
      "mystream",
      "mygroup",
      "DELREF",
      "IDS",
      2,
      "1234-0",
      "1235-0",
    ]);
  });

});
