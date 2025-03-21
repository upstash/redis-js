import { EvalROCommand } from "./eval_ro";

import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without keys", () => {
  test("returns something", async () => {
    const value = randomID();
    const res = await new EvalROCommand(["return ARGV[1]", [], [value]]).exec(client);
    expect(res).toEqual(value);
  });
});

describe("with keys", () => {
  test("returns something", async () => {
    const value = randomID();
    const key = newKey();
    await new SetCommand([key, value]).exec(client);
    const res = await new EvalROCommand([`return redis.call("GET", KEYS[1])`, [key], []]).exec(
      client
    );
    expect(res).toEqual(value);
  });
});

describe("with keys and write commands", () => {
  test("throws", async () => {
    const value = randomID();
    const key = newKey();
    await new SetCommand([key, value]).exec(client);
    expect(async () => {
      await new EvalROCommand([`return redis.call("DEL", KEYS[1])`, [key], []]).exec(client);
    }).toThrow();
  });
});
