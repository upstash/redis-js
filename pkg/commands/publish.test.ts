import { newHttpClient } from "../test-utils";

import { PublishCommand } from "./publish";

const client = newHttpClient();

test("returns the number of clients that received the message", async () => {
  const res = await new PublishCommand(["channel", "hello"]).exec(client);

  expect(typeof res, "number");
});
