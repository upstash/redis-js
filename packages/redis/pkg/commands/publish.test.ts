import { expect, test } from "bun:test";
import { newHttpClient } from "../test-utils";

import { PublishCommand } from "./publish";

const client = newHttpClient();

test.skip("returns the number of clients that received the message", async () => {
  const res = await new PublishCommand(["channel", "hello"]).exec(client);

  expect(typeof res).toBe("number");
});
