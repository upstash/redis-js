import { addNewItemToStream, keygen, newHttpClient } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { UNBALANCED_XREAD_ERR, XReadCommand } from "./xread";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("COUNT", () => {
  test("should return successfully", async () => {
    const streamKey = newKey();
    const { member1: xmember1, member2: xmember2 } = await addNewItemToStream(streamKey, client);

    const res = (await new XReadCommand([streamKey, "0-0"]).exec(client)) as string[];

    expect(res[0][1][0][1]).toEqual(["field1", xmember1, "field2", xmember2]);
  });
  test("should return multiple items", async () => {
    const wantedLength = 3;
    const streamKey = newKey();
    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);

    const res = (await new XReadCommand([streamKey, "0-0", { count: wantedLength }]).exec(
      client,
    )) as any[];

    expect(res[0][1].length).toBe(wantedLength);
  });
  test("should return desired amount of items", async () => {
    const wantedLength = 2;
    const streamKey = newKey();
    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);
    await addNewItemToStream(streamKey, client);

    const res = (await new XReadCommand([streamKey, "0-0", { count: wantedLength }]).exec(
      client,
    )) as any[];

    expect(res[0][1].length).toBe(wantedLength);
  });
});

describe("IDs", () => {
  test(
    "should return items with given id",
    async () => {
      const streamKey = newKey();
      await addNewItemToStream(streamKey, client);

      const res = (await new XReadCommand([streamKey, `${Date.now() - 15000}-0`]).exec(
        client,
      )) as string[];
      expect(res).toBeInstanceOf(Array);
    },
    { retry: 3 },
  );
});

describe("Multiple stream", () => {
  test(
    "should return items with multiple streams and ids",
    async () => {
      const wantedLength = 2;

      const streamKey1 = newKey();
      await addNewItemToStream(streamKey1, client);
      const streamKey2 = newKey();
      await addNewItemToStream(streamKey2, client);

      const res = (await new XReadCommand([
        [streamKey1, streamKey2],
        ["0-0", "0-0"],
      ]).exec(client)) as string[];
      expect(res.length).toBe(wantedLength);
    },
    { retry: 3 },
  );

  test(
    "should return only 1 stream",
    async () => {
      const wantedLength = 1;

      const streamKey1 = newKey();
      await addNewItemToStream(streamKey1, client);

      const res = (await new XReadCommand([
        [streamKey1, newKey()],
        ["0-0", "0-0"],
      ]).exec(client)) as string[];
      expect(res.length).toBe(wantedLength);
    },
    { retry: 3 },
  );

  test(
    "should throw when unbalanced is array passed",
    async () => {
      const throwable = async () => {
        const streamKey1 = newKey();
        await addNewItemToStream(streamKey1, client);

        await new XReadCommand([[streamKey1, newKey()], ["0-0"]]).exec(client);
      };

      expect(throwable).toThrow(UNBALANCED_XREAD_ERR);
    },
    { retry: 3 },
  );
});
