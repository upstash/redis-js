import { EvalCommand } from "./eval";

import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, describe, expect, test } from "bun:test";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without keys", () => {
  test("returns something", async () => {
    const value = randomID();
    const res = await new EvalCommand(["return ARGV[1]", [], [value]]).exec(client);
    expect(res).toEqual(value);
  });
});

describe("with keys", () => {
  test("returns something", async () => {
    const value = randomID();
    const key = newKey();
    await new SetCommand([key, value]).exec(client);
    const res = await new EvalCommand([`return redis.call("GET", KEYS[1])`, [key], []]).exec(
      client,
    );
    expect(res).toEqual(value);
  });
});
