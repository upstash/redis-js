import { keygen, newHttpClient } from "./test-utils";

import { afterAll, describe, expect, test } from "bun:test";
// import { GetCommand } from "./get";
// import { SetCommand } from "./set";
import { SetCommand } from "./commands/set";

const client = newHttpClient();

const { cleanup } = keygen();
afterAll(cleanup);
describe("Read Your Writes", () => {
  test("successfully retrieves Upstash-Sync-Token in the response header", async () => {
    const initialSync = client._upstashSyncToken;
    await new SetCommand(["key", "value"]).exec(client);
    const updatedSync = client._upstashSyncToken;
    await new SetCommand(["key", "value"]).exec(client);

    expect(updatedSync).not.toEqual(initialSync);
  });
});
