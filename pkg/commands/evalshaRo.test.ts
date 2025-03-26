import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { EvalshaROCommand } from "./evalshaRo";
import { ScriptLoadCommand } from "./script_load";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without keys", () => {
  test("returns something", async () => {
    const value = randomID();
    const sha1 = await new ScriptLoadCommand([`return {ARGV[1], "${value}"}`]).exec(client);
    const res = await new EvalshaROCommand([sha1, [], [value]]).exec(client);
    expect(res).toEqual([value, value]);
  });
});

describe("with keys", () => {
  test("returns something", async () => {
    const value = randomID();
    const key = newKey();
    await new SetCommand([key, value]).exec(client);
    const sha1 = await new ScriptLoadCommand([`return redis.call("GET", KEYS[1])`]).exec(client);
    const res = await new EvalshaROCommand([sha1, [key], []]).exec(client);
    expect(res).toEqual(value);
  });
});

describe("with keys and write commands", () => {
  test("throws", async () => {
    const value = randomID();
    const key = newKey();
    await new SetCommand([key, value]).exec(client);
    const sha1 = await new ScriptLoadCommand([`return redis.call("DEL", KEYS[1])`]).exec(client);
    expect(async () => {
      await new EvalshaROCommand([sha1, [key], []]).exec(client);
    }).toThrow();
  });
});
