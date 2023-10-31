import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { CopyCommand } from "./copy";
import { LPushCommand } from "./lpush";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("COPY test", () => {
  test("should copy key-value to another key", async () => {
    const key = newKey();
    const destinationKey = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new CopyCommand([key, destinationKey]).exec(client);
    expect(res).toEqual("COPIED");
  });

  test("should not override existing destination", async () => {
    const key = newKey();
    const destinationKey = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    await new SetCommand([destinationKey, value]).exec(client);
    const res = await new CopyCommand([key, destinationKey]).exec(client);
    expect(res).toEqual("NOT_COPIED");
  });

  test("should override existing destination with replace", async () => {
    const key = newKey();
    const destinationKey = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    await new SetCommand([destinationKey, value]).exec(client);
    const res = await new CopyCommand([key, destinationKey, { replace: true }]).exec(client);
    expect(res).toEqual("COPIED");
  });

  test("should handle non-existent source key", async () => {
    const key = newKey();
    const destinationKey = newKey();
    const res = await new CopyCommand([key, destinationKey]).exec(client);
    expect(res).toEqual("NOT_COPIED");
  });

  test("should handle same source and destination keys", async () => {
    const key = newKey();
    const value = randomID();
    await new SetCommand([key, value]).exec(client);
    const res = await new CopyCommand([key, key]).exec(client);
    expect(res).toEqual("NOT_COPIED");
  });

  test("should copy list data type", async () => {
    const key = newKey();
    const destinationKey = newKey();
    await new LPushCommand([key, "value1", "value2"]).exec(client);
    const res = await new CopyCommand([key, destinationKey]).exec(client);
    expect(res).toEqual("COPIED");
  });
});
