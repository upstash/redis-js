import { addNewItemToStream, keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XClaimCommand } from "./xclaim";
import { XGroupCommand } from "./xgroup";
import { XReadGroupCommand } from "./xreadgroup";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XCLAIM", () => {
  test("should move ownership from one consumer to other", async () => {
    const streamKey = newKey();
    const group = newKey();
    const consumer1 = newKey();
    const consumer2 = newKey();
    const consumer3 = newKey();

    await addNewItemToStream(streamKey, client);
    const { streamId: streamId2 } = await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer1, [streamKey], [">"], { count: 1 }]).exec(client);

    await new XReadGroupCommand([group, consumer2, [streamKey], [">"], { count: 1 }]).exec(client);

    await new XReadGroupCommand([group, consumer3, [streamKey], [">"], { count: 1 }]).exec(client);

    const res = (await new XClaimCommand([streamKey, group, consumer3, 100, streamId2]).exec(
      client,
    )) as string[];

    expect(res).toBeInstanceOf(Array);
    expect(res[0][0]).toBe(streamId2);
  });

  test("should claim a message and set its idle time to 10000 milliseconds", async () => {
    const streamKey = newKey();
    const group = newKey();
    const consumer1 = newKey();
    const consumer3 = newKey();

    const { streamId } = await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer1, [streamKey], [">"], { count: 1 }]).exec(client);

    await new XReadGroupCommand([group, consumer3, [streamKey], [">"], { count: 1 }]).exec(client);

    const res = (await new XClaimCommand([
      streamKey,
      group,
      consumer3,
      0,
      streamId,
      {
        justId: true,
      },
    ]).exec(client)) as string[];

    expect(res).toEqual([streamId]);
  });
});
