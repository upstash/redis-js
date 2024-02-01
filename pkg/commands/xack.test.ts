import { addNewItemToStream, keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XAckCommand } from "./xack";
import { XGroupCommand } from "./xgroup";
import { XReadGroupCommand } from "./xreadgroup";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XACK", () => {
  test("should acknowledge a message successfully", async () => {
    const streamKey1 = newKey();
    const group = newKey();
    const consumer = newKey();

    const { streamId: streamId1 } = await addNewItemToStream(streamKey1, client);
    const { streamId: streamId2 } = await addNewItemToStream(streamKey1, client);

    await new XGroupCommand([streamKey1, { type: "CREATE", group, id: "0" }]).exec(client);

    (await new XReadGroupCommand([group, consumer, streamKey1, ">", { count: 2 }]).exec(
      client,
    )) as string[];

    const res = await new XAckCommand([streamKey1, group, [streamId1, streamId2]]).exec(client);
    expect(res).toEqual(2);
  });

  test("should try to re-acknowledge and return 0", async () => {
    const streamKey1 = newKey();
    const group = newKey();
    const consumer = newKey();

    const { streamId: streamId1 } = await addNewItemToStream(streamKey1, client);

    await new XGroupCommand([
      streamKey1,
      { type: "CREATE", group, id: "0", options: { MKSTREAM: true } },
    ]).exec(client);

    (await new XReadGroupCommand([group, consumer, streamKey1, ">", { count: 2 }]).exec(
      client,
    )) as string[];

    const res = await new XAckCommand([streamKey1, group, streamId1]).exec(client);
    expect(res).toEqual(1);
    const res1 = await new XAckCommand([streamKey1, group, streamId1]).exec(client);
    expect(res1).toEqual(0);
  });
});
