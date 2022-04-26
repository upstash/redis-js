import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, expect, it } from "@jest/globals";
import { SetCommand } from "./set";
import { ExpireCommand } from "./expire";
import { GetCommand } from "./get";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "expires a key correctly",
  async () => {
    const key = newKey();
    const value = randomUUID();
    await new SetCommand(key, value).exec(client);
    const res = await new ExpireCommand(key, 1).exec(client);
    expect(res).toEqual(1);
    await new Promise((res) => setTimeout(res, 2000));
    const res2 = await new GetCommand(key).exec(client);

    expect(res2).toBeNull();
  },
);
