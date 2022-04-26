import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { GetCommand } from "./get.ts";
import { SetCommand } from "./set.ts";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
describe(
  "without options",
  () => {
    it(
      "sets value",
      async () => {
        const key = newKey();
        const value = crypto.randomUUID();

        const res = await new SetCommand(key, value).exec(client);
        assertEquals(res, "OK");
        const res2 = await new GetCommand(key).exec(client);
        assertEquals(res2, value);
      },
    );
  },
);
describe(
  "ex",
  () => {
    it(
      "sets value",
      async () => {
        const key = newKey();
        const value = crypto.randomUUID();

        const res = await new SetCommand(key, value, { ex: 1 }).exec(client);
        assertEquals(res, "OK");
        const res2 = await new GetCommand(key).exec(client);
        assertEquals(res2, value);
        await new Promise((res) => setTimeout(res, 2000));

        const res3 = await new GetCommand(key).exec(client);
        assertEquals(res3, null);
      },
    );
  },
);
describe(
  "px",
  () => {
    it(
      "sets value",
      async () => {
        const key = newKey();
        const value = crypto.randomUUID();

        const res = await new SetCommand(key, value, { px: 1000 }).exec(client);
        assertEquals(res, "OK");
        const res2 = await new GetCommand(key).exec(client);
        assertEquals(res2, value);
        await new Promise((res) => setTimeout(res, 2000));

        const res3 = await new GetCommand(key).exec(client);

        assertEquals(res3, null);
      },
    );
  },
);
describe(
  "nx",
  () => {
    describe(
      "when key exists",
      () => {
        it(
          "does nothing",
          async () => {
            const key = newKey();
            const value = crypto.randomUUID();
            const newValue = crypto.randomUUID();

            await new SetCommand(key, value).exec(client);
            const res = await new SetCommand(key, newValue, { nx: true }).exec(
              client,
            );
            assertEquals(res, null);
            const res2 = await new GetCommand(key).exec(client);
            assertEquals(res2, value);
          },
        );
      },
    );
    describe(
      "when key does not exists",
      () => {
        it(
          "overwrites key",
          async () => {
            const key = newKey();
            const value = crypto.randomUUID();

            const res = await new SetCommand(key, value, { nx: true }).exec(
              client,
            );
            assertEquals(res, "OK");
            const res2 = await new GetCommand(key).exec(client);
            assertEquals(res2, value);
          },
        );
      },
    );
  },
);
describe(
  "xx",
  () => {
    describe(
      "when key exists",
      () => {
        it(
          "overwrites key",
          async () => {
            const key = newKey();
            const value = crypto.randomUUID();
            const newValue = crypto.randomUUID();

            await new SetCommand(key, value).exec(client);
            const res = await new SetCommand(key, newValue, { xx: true }).exec(
              client,
            );
            assertEquals(res, "OK");
            const res2 = await new GetCommand(key).exec(client);
            assertEquals(res2, newValue);
          },
        );
      },
    );
    describe(
      "when key does not exists",
      () => {
        it(
          "does nothing",
          async () => {
            const key = newKey();
            const value = crypto.randomUUID();

            const res = await new SetCommand(key, value, { xx: true }).exec(
              client,
            );
            assertEquals(res, null);
            const res2 = await new GetCommand(key).exec(client);
            assertEquals(res2, null);
          },
        );
      },
    );
  },
);
