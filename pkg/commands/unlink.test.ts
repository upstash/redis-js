import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, expect, it } from "@jest/globals";
import { MSetCommand } from "./mset";
import { UnlinkCommand } from "./unlink";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "unlinks the keys",
  async () => {
    const key1 = newKey();
    const key2 = newKey();
    const key3 = newKey();
    const kv: Record<string, string> = {};
    kv[key1] = randomUUID();
    kv[key2] = randomUUID();
    await new MSetCommand(kv).exec(client);
    const res = await new UnlinkCommand(key1, key2, key3).exec(client);
    expect(res).toEqual(2);
  },
);
