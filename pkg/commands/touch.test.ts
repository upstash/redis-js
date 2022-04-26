import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, expect, it } from "@jest/globals";
import { MSetCommand } from "./mset";
import { TouchCommand } from "./touch";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the number of touched keys",
  async () => {
    const key1 = newKey();
    const key2 = newKey();
    const kv: Record<string, string> = {};
    kv[key1] = randomUUID();
    kv[key2] = randomUUID();
    await new MSetCommand(kv).exec(client);
    const res = await new TouchCommand(key1, key2).exec(client);
    expect(res).toBe(2);
  },
);
