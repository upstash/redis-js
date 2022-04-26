import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, expect, it } from "@jest/globals";
import { SetCommand } from "./set";
import { DBSizeCommand } from "./dbsize";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "returns the db size",
  async () => {
    const key = newKey();
    const value = randomUUID();
    await new SetCommand(key, value).exec(client);
    const res = await new DBSizeCommand().exec(client);
    expect(res).toBeGreaterThan(0);
  },
);
