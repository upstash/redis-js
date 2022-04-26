import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, describe, expect, it } from "@jest/globals";
import { HMSetCommand } from "./hmset";
import { HLenCommand } from "./hlen";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "with existing hash",
  () => {
    it(
      "returns correct number of keys",
      async () => {
        const key = newKey();
        const field1 = randomUUID();
        const field2 = randomUUID();

        const kv: Record<string, string> = {};
        kv[field1] = randomUUID();
        kv[field2] = randomUUID();
        await new HMSetCommand(key, kv).exec(client);
        const res = await new HLenCommand(key).exec(client);
        expect(res).toEqual(2);
      },
    );
  },
);
