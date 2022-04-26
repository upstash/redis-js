import { newHttpClient } from "../test-utils";
import { describe, expect, it } from "@jest/globals";
import { FlushDBCommand } from "./flushdb";
const client = newHttpClient();

describe(
  "without options",
  () => {
    it(
      "flushes the db",
      async () => {
        const res = await new FlushDBCommand().exec(client);
        expect(res).toBe("OK");
      },
    );
  },
);
describe(
  "async",
  () => {
    it(
      "flushes the db",
      async () => {
        const res = await new FlushDBCommand({ async: true }).exec(client);
        expect(res).toBe("OK");
      },
    );
  },
);
