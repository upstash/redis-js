import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, expect, it } from "@jest/globals";
import { MSetCommand } from "./mset";
import { MGetCommand } from "./mget";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "gets exiting values",
  async () => {
    const key1 = newKey();
    const key2 = newKey();
    const kv = { [key1]: randomUUID(), [key2]: randomUUID() };
    const res = await new MSetCommand(kv).exec(client);

    expect(res).toEqual("OK");
    const res2 = await new MGetCommand(key1, key2).exec(client);
    expect(res2).toEqual(Object.values(kv));
  },
);
