import { addNewItemToStream, keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XGroupCommand } from "./xgroup";
import { XInfoCommand } from "./xinfo";
import { XReadGroupCommand } from "./xreadgroup";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("GROUPS", () => {
  test("should return empty array when there is no group", async () => {
    const wantedAmount = 3;
    const streamKey = newKey();

    for (let i = 0; i < wantedAmount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    const res = (await new XInfoCommand([streamKey, { type: "GROUPS" }]).exec(client)) as string[];
    expect(res).toEqual([]);
  });

  test("should return given group id", async () => {
    const wantedAmount = 3;
    const streamKey = newKey();
    const group = newKey();

    for (let i = 0; i < wantedAmount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    const res = (await new XInfoCommand([streamKey, { type: "GROUPS" }]).exec(client)) as string[];
    expect(res[0][1]).toEqual(group);
  });
});

describe("CONSUMERS", () => {
  test("should return empty array when there is no consumer", async () => {
    const wantedAmount = 3;
    const streamKey = newKey();
    const group = newKey();

    for (let i = 0; i < wantedAmount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    const res = (await new XInfoCommand([streamKey, { type: "CONSUMERS", group }]).exec(
      client
    )) as string[];

    expect(res).toEqual([]);
  });

  test("should return empty array when there is no consumer", async () => {
    const wantedAmount = 3;
    const streamKey = newKey();
    const group = newKey();
    const consumer = newKey();

    for (let i = 0; i < wantedAmount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    (await new XReadGroupCommand([group, consumer, streamKey, ">"]).exec(client)) as string[];

    const res = (await new XInfoCommand([streamKey, { type: "CONSUMERS", group }]).exec(
      client
    )) as string[];
    const pendingCount = res[0][3];

    expect(pendingCount).toBe(wantedAmount);
  });
});
