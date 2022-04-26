import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, expect, it } from "@jest/globals";
import { MSetCommand } from "./mset";
import { MGetCommand } from "./mget";

import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "gets exiting values",
  async () => {
    const key1 = newKey();
    const value1 = randomUUID();
    const key2 = newKey();
    const value2 = randomUUID();

    const kv: Record<string, string> = {};
    kv[key1] = value1;
    kv[key2] = value2;
    const res = await new MSetCommand(kv).exec(client);

    expect(res).toEqual("OK");
    const res2 = await new MGetCommand<[string, string]>(key1, key2).exec(
      client,
    );

    expect(res2).toEqual([value1, value2]);
  },
);

it(
  "gets a non-existing value",
  async () => {
    const key = newKey();
    const res = await new MGetCommand<[null]>(key).exec(client);

    expect(res).toEqual([null]);
  },
);

it(
  "gets an object",
  async () => {
    const key = newKey();
    const value = { v: randomUUID() };
    await new SetCommand(key, value).exec(client);
    const res = await new MGetCommand<[{ v: string }]>(key).exec(client);

    expect(res).toEqual([value]);
  },
);
