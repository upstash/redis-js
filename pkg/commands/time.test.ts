import { newHttpClient } from "../test-utils";
import { expect, it } from "@jest/globals";
import { TimeCommand } from "./time";
const client = newHttpClient();

it(
  "returns the time",
  async () => {
    const res = await new TimeCommand().exec(client);
    expect(res).toBeDefined();
    expect(typeof res[0]).toBe("number");
    expect(typeof res[1]).toBe("number");
  },
);
