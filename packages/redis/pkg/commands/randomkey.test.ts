import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { RandomKeyCommand } from "./randomkey";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns a random key", async () => {
  const key = newKey();
  await new SetCommand([key, randomID()]).exec(client);
  const res = await new RandomKeyCommand().exec(client);
  expect(typeof res).toBe("string");
});
