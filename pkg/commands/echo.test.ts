import { newHttpClient, randomID } from "../test-utils";

import { expect, test } from "bun:test";
import { EchoCommand } from "./echo";
const client = newHttpClient();

test("returns the message", async () => {
  const message = randomID();
  const res = await new EchoCommand([message]).exec(client);
  expect(res).toEqual(message);
});
