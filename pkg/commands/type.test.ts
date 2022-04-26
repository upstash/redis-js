import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, describe, expect, it } from "@jest/globals";
import { SetCommand } from "./set";
import { TypeCommand } from "./type";
import { LPushCommand } from "./lpush";
import { HSetCommand } from "./hset";
import { SAddCommand } from "./sadd";
import { ZAddCommand } from "./zadd";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "string",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = randomUUID();
        await new SetCommand(key, value).exec(client);
        const res = await new TypeCommand(key).exec(client);
        expect(res).toEqual("string");
      },
    );
  },
);

describe(
  "list",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = randomUUID();
        await new LPushCommand(key, value).exec(client);
        const res = await new TypeCommand(key).exec(client);
        expect(res).toEqual("list");
      },
    );
  },
);

describe(
  "set",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const value = randomUUID();
        await new SAddCommand(key, value).exec(client);
        const res = await new TypeCommand(key).exec(client);
        expect(res).toEqual("set");
      },
    );
  },
);

describe(
  "hash",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const field = randomUUID();
        const value = randomUUID();
        await new HSetCommand(key, { [field]: value }).exec(client);
        const res = await new TypeCommand(key).exec(client);
        expect(res).toEqual("hash");
      },
    );
  },
);

describe(
  "zset",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const member = randomUUID();
        await new ZAddCommand(key, { score: 0, member }).exec(client);
        const res = await new TypeCommand(key).exec(client);
        expect(res).toEqual("zset");
      },
    );
  },
);

describe(
  "none",
  () => {
    it(
      "returns the correct type",
      async () => {
        const key = newKey();
        const res = await new TypeCommand(key).exec(client);
        expect(res).toEqual("none");
      },
    );
  },
);
