import { addNewItemToStream, keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XGroupCommand } from "./xgroup";
import { XInfoCommand } from "./xinfo";
import { UNBALANCED_XREADGROUP_ERR, XReadGroupCommand } from "./xreadgroup";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("COUNT", () => {
  test("should read everything into given xreadgroup and mark them as pending", async () => {
    const wantedAmount = 3;
    const streamKey = newKey();
    const group = newKey();
    const consumer = newKey();

    for (let i = 0; i < wantedAmount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    const res = (await new XReadGroupCommand([group, consumer, streamKey, ">"]).exec(
      client,
    )) as string[];
    const listOfStreams = res[0][1];

    expect(listOfStreams.length).toEqual(wantedAmount);
  });

  test("should read given amount of streams into given xreadgroup and mark them as pending", async () => {
    const wantedAmount = 2;
    const streamKey = newKey();
    const group = newKey();
    const consumer = newKey();

    for (let i = 0; i < wantedAmount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    const res = (await new XReadGroupCommand([
      group,
      consumer,
      streamKey,
      ">",
      { count: wantedAmount },
    ]).exec(client)) as string[];
    const listOfStreams = res[0][1];

    expect(listOfStreams.length).toEqual(wantedAmount);
  });
});

describe("NOACK", () => {
  test("should return 0 items in PEL", async () => {
    const streamKey = newKey();
    const group = newKey();
    const consumer = newKey();

    await addNewItemToStream(streamKey, client);

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer, streamKey, ">", { NOACK: true }]).exec(client);

    const xinfoRes = (await new XInfoCommand([streamKey, { type: "CONSUMERS", group }]).exec(
      client,
    )) as string[];
    expect(xinfoRes).toEqual([]);
  });

  test("should return desired amount of items in PEL", async () => {
    const wantedCount = 5;
    const streamKey = newKey();
    const group = newKey();
    const consumer = newKey();

    for (let i = 0; i < wantedCount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer, streamKey, ">", { NOACK: false }]).exec(client);

    const xinfoRes = (await new XInfoCommand([streamKey, { type: "CONSUMERS", group }]).exec(
      client,
    )) as string[];

    const pendingCount = xinfoRes[0][3];

    expect(pendingCount).toBe(wantedCount);
  });
});

describe("Multiple Stream", () => {
  test("should read given amount of streams into given xreadgroup and mark them as pending", async () => {
    const streamKey1 = newKey();
    const streamKey2 = newKey();
    const group = newKey();
    const consumer = newKey();

    await addNewItemToStream(streamKey1, client);
    await addNewItemToStream(streamKey1, client);
    await addNewItemToStream(streamKey2, client);
    await addNewItemToStream(streamKey2, client);

    await new XGroupCommand([streamKey1, { type: "CREATE", group, id: "0" }]).exec(client);
    await new XGroupCommand([streamKey2, { type: "CREATE", group, id: "0" }]).exec(client);

    const res = (await new XReadGroupCommand([
      group,
      consumer,
      [streamKey1, streamKey2],
      [">", ">"],
      { count: 1 },
    ]).exec(client)) as string[];
    expect(res.length).toEqual(2);
  });

  test("should read everything into given xreadgroup and mark them as pending", async () => {
    const wantedAmount = 4;
    const streamKey = newKey();
    const group = newKey();
    const consumer = newKey();

    for (let i = 0; i < wantedAmount; i++) {
      await addNewItemToStream(streamKey, client);
    }

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    const res = (await new XReadGroupCommand([
      group,
      consumer,
      streamKey,
      ">",
      { count: wantedAmount },
    ]).exec(client)) as string[];
    const listOfStreams = res[0][1];

    expect(listOfStreams.length).toEqual(wantedAmount);
  });

  test("should throw when unbalanced is array passed", async () => {
    const throwable = async () => {
      const streamKey = newKey();
      const group = newKey();
      const consumer = newKey();

      await addNewItemToStream(streamKey, client);

      await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

      await new XReadGroupCommand([group, consumer, [streamKey, newKey()], ["0-0"]]).exec(client);
    };

    expect(throwable).toThrow(UNBALANCED_XREADGROUP_ERR);
  });
});
