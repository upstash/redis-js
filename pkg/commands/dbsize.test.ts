import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test } from "bun:test";
import { DBSizeCommand } from "./dbsize";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

test("returns the db size", async () => {
  const key = newKey();
  const value = randomID();
  await new SetCommand([key, value]).exec(client);
  const res = await new DBSizeCommand().exec(client);
  expect(res > 0).toEqual(true);
});
