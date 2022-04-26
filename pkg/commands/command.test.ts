import { Command } from "./command";
import { keygen, newHttpClient } from "../test-utils";
import { randomUUID } from "crypto";
import { afterAll, describe, expect, it } from "@jest/globals";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe(
  "deserialize large numbers",
  () => {
    it(
      "returns the correct number",
      async () => {
        const key = newKey();
        const field = randomUUID();
        const value = "101600000000150081467";

        await new Command(["hset", key, field, value]).exec(client);

        const res = await new Command(["hget", key, field]).exec(client);
        expect(res).toEqual(value);
      },
    );
  },
);
