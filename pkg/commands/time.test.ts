import { newHttpClient } from "../test-utils";

import { TimeCommand } from "./time";
const client = newHttpClient();

test("returns the time", async () => {
  const res = await new TimeCommand().exec(client);

  expect(typeof res[0], "number");
  expect(typeof res[1], "number");
});
