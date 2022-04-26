import { keygen, newHttpClient } from "../test-utils";
import { afterAll, expect, it } from "@jest/globals";
import { SetCommand } from "./set";
import { IncrCommand } from "./incr";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

it(
  "increments a non-existing value",
  async () => {
    const key = newKey();
    const res = await new IncrCommand(key).exec(client);

    expect(res).toEqual(1);
  },
);

it(
  "increments and existing value",
  async () => {
    const key = newKey();
    await new SetCommand(key, 4).exec(client);
    const res = await new IncrCommand(key).exec(client);

    expect(res).toEqual(5);
  },
);
