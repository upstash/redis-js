import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { XAddCommand } from "./xadd";
import { UNBALANCED_XREAD_ERR, XReadCommand } from "./xread";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("COUNT", () => {
  test("should return desired amount of items", async () => {
    const streamKey = newKey();
    const { member1: xmember1, member2: xmember2 } = await addNewItemToStream(
      streamKey
    );

    const res = (await new XReadCommand([streamKey, "0-0"]).exec(
      client
    )) as string[];

    expect(res[0][1][0][1]).toEqual(["field1", xmember1, "field2", xmember2]);
  });
  test("should return desired amount of items", async () => {
    const wantedLength = 3;
    const streamKey = newKey();
    await addNewItemToStream(streamKey);
    await addNewItemToStream(streamKey);
    await addNewItemToStream(streamKey);

    const res = (await new XReadCommand([
      streamKey,
      "0-0",
      { count: wantedLength },
    ]).exec(client)) as any[];

    expect(res[0][1].length).toBe(wantedLength);
  });
  test("should return desired amount of items", async () => {
    const wantedLength = 2;
    const streamKey = newKey();
    await addNewItemToStream(streamKey);
    await addNewItemToStream(streamKey);
    await addNewItemToStream(streamKey);

    const res = (await new XReadCommand([
      streamKey,
      "0-0",
      { count: wantedLength },
    ]).exec(client)) as any[];

    expect(res[0][1].length).toBe(wantedLength);
  });
  test("should return desired amount of items", async () => {
    const wantedLength = 2;
    const streamKey = newKey();
    await addNewItemToStream(streamKey);
    await addNewItemToStream(streamKey);
    await addNewItemToStream(streamKey);

    const res = (await new XReadCommand([
      streamKey,
      "0-0",
      { count: wantedLength },
    ]).exec(client)) as any[];

    expect(res[0][1].length).toBe(wantedLength);
  });
});

describe("IDs", () => {
  test("should return desired amount of items", async () => {
    const streamKey = newKey();
    await addNewItemToStream(streamKey);

    const res = (await new XReadCommand([
      streamKey,
      `${Date.now() - 10 - 0}`,
    ]).exec(client)) as string[];
    const res1 = (await new XReadCommand([streamKey, "0-0"]).exec(
      client
    )) as string[];

    expect(res).toEqual(res1);
  });
});

describe("Multiple stream", () => {
  test("should return desired amount of items", async () => {
    const wantedLength = 2;

    const streamKey1 = newKey();
    await addNewItemToStream(streamKey1);
    const streamKey2 = newKey();
    await addNewItemToStream(streamKey2);

    const res = (await new XReadCommand([
      [streamKey1, streamKey2],
      ["0-0", "0-0"],
    ]).exec(client)) as string[];
    expect(res.length).toBe(wantedLength);
  });

  test("should return only 1 stream", async () => {
    const wantedLength = 1;

    const streamKey1 = newKey();
    await addNewItemToStream(streamKey1);

    const res = (await new XReadCommand([
      [streamKey1, newKey()],
      ["0-0", "0-0"],
    ]).exec(client)) as string[];
    expect(res.length).toBe(wantedLength);
  });

  test("should throw when unbalanced is array passed", async () => {
    const throwable = async () => {
      const streamKey1 = newKey();
      await addNewItemToStream(streamKey1);

      await new XReadCommand([[streamKey1, newKey()], ["0-0"]]).exec(client);
    };

    expect(throwable).toThrow(UNBALANCED_XREAD_ERR);
  });
});

async function addNewItemToStream(streamKey: string) {
  const field1 = "field1";
  const member1 = randomID();
  const field2 = "field2";
  const member2 = randomID();

  const res = await new XAddCommand([
    streamKey,
    "*",
    { [field1]: member1, [field2]: member2 },
  ]).exec(client);
  return { member1, member2, streamId: res };
}
