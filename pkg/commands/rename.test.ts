import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";

import { RenameCommand } from "./rename";
import { SetCommand } from "./set";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("renames the key", async () => {
  const source = newKey();
  const destination = newKey();
  const value = randomID();
  await new SetCommand([source, value]).exec(client);
  const res = await new RenameCommand([source, destination]).exec(client);
  expect(res).toEqual("OK");
});
