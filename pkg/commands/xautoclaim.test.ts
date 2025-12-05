import { addNewItemToStream, keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { sleep } from "bun";
import { XAutoClaim } from "./xautoclaim";
import { XGroupCommand } from "./xgroup";
import { XReadGroupCommand } from "./xreadgroup";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("XCLAIM", () => {
  test("should move ownership to newly created consumer ", async () => {
    const streamKey = newKey();
    const group = newKey();
    const consumer1 = newKey();
    const consumer2 = newKey();

    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer1, [streamKey], [">"], { count: 2 }]).exec(client);

    const res = (await new XAutoClaim([streamKey, group, consumer2, 10, "0-0", { count: 1 }]).exec(
      client
    )) as string[];
    expect(res).toBeInstanceOf(Array);
  });

  test("should try to move ownership and fail due to too high idle time", async () => {
    const streamKey = newKey();
    const group = newKey();
    const consumer1 = newKey();
    const consumer2 = newKey();

    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer1, [streamKey], [">"], { count: 2 }]).exec(client);
    await sleep(2000);
    const res = (await new XAutoClaim([
      streamKey,
      group,
      consumer2,
      3000,
      "0-0",
      { count: 1 },
    ]).exec(client)) as string[];
    expect(res).toEqual(["0-0", [], []]);
  });

  test("should successfull move the ownership with idle time", async () => {
    const streamKey = newKey();
    const group = newKey();
    const consumer1 = newKey();
    const consumer2 = newKey();

    await addNewItemToStream(streamKey, client);
    const { streamId } = await addNewItemToStream(streamKey, client);

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer1, [streamKey], [">"], { count: 2 }]).exec(client);
    await sleep(2000);
    const xclaim = (await new XAutoClaim([
      streamKey,
      group,
      consumer2,
      1000,
      "0-0",
      { count: 1 },
    ]).exec(client)) as string[];
    expect(xclaim[0]).toEqual(streamId);
  });

  test("should successfull return justid", async () => {
    const streamKey = newKey();
    const group = newKey();
    const consumer1 = newKey();
    const consumer2 = newKey();

    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);

    await new XGroupCommand([streamKey, { type: "CREATE", group, id: "0" }]).exec(client);

    await new XReadGroupCommand([group, consumer1, [streamKey], [">"], { count: 2 }]).exec(client);

    const xclaim = (await new XAutoClaim([
      streamKey,
      group,
      consumer2,
      0,
      "0-0",
      { count: 1, justId: true },
    ]).exec(client)) as string[];
    expect(xclaim[1].length).toBe(1);
  });
});
