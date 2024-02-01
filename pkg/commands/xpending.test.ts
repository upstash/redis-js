import { addNewItemToStream, keygen, newHttpClient } from "../test-utils";

import { afterAll, afterEach, beforeEach, describe, expect, test } from "bun:test";
import { sleep } from "bun";
import { XGroupCommand } from "./xgroup";
import { XPendingCommand } from "./xpending";
import { XReadGroupCommand } from "./xreadgroup";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XPENDING", () => {
  const streamKey1 = newKey();
  const group = newKey();
  const consumer = newKey();

  beforeEach(async () => {
    await new XGroupCommand([
      streamKey1,
      { type: "CREATE", group, id: "0", options: { MKSTREAM: true } },
    ]).exec(client);
    await addNewItemToStream(streamKey1, client);

    await new XReadGroupCommand([group, consumer, streamKey1, ">", { count: 1 }]).exec(client);
  });
  afterEach(cleanup);

  test("should get pending messages", async () => {
    const pending = await new XPendingCommand([streamKey1, group, "-", "+", 10]).exec(client);

    expect(pending).toBeInstanceOf(Array);
    expect(pending.length).toBeGreaterThan(0);
  });

  test("should get pending messages with idle time", async () => {
    await sleep(1000);
    const pending = await new XPendingCommand([
      streamKey1,
      group,
      "-",
      "+",
      10,
      { idleTime: 500 },
    ]).exec(client);

    expect(pending).toBeInstanceOf(Array);
    expect(pending.length).toBeGreaterThan(0);
  });

  test("should not get pending messages with idle time", async () => {
    await sleep(350);
    const pending = await new XPendingCommand([
      streamKey1,
      group,
      "-",
      "+",
      10,
      { idleTime: 500 },
    ]).exec(client);

    expect(pending).toBeInstanceOf(Array);
    expect(pending.length).toEqual(0);
  });

  test("should get specific consumer", async () => {
    const newConsumer = newKey();
    await new XReadGroupCommand([group, newConsumer, streamKey1, ">", { count: 1 }]).exec(client);

    const pending = await new XPendingCommand([
      streamKey1,
      group,
      "-",
      "+",
      10,
      {
        consumer: newConsumer,
      },
    ]).exec(client);

    const pending1 = await new XPendingCommand([
      streamKey1,
      group,
      "-",
      "+",
      10,
      {
        consumer,
      },
    ]).exec(client);

    expect(pending.length).toEqual(0);
    expect(pending1.length).toEqual(1);
  });
});
