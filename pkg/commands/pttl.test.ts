import { keygen, newHttpClient } from "../test-utils";
import { PTtlCommand } from "./pttl";
import { SetExCommand } from "./setex";
import { afterAll, expect, it } from "@jest/globals";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the ttl on a key",
  async () => {
    const key = newKey();
    const ttl = 60;
    await new SetExCommand(key, ttl, "value").exec(client);
    const res = await new PTtlCommand(key).exec(client);
    expect(res).toBeLessThanOrEqual(ttl * 1000);
  },
);
