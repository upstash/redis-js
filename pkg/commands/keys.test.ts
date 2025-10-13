import { afterAll, expect, test, describe } from "bun:test";
import { keygen, newHttpClient } from "../test-utils";
import { KeysCommand } from "./keys";
import { SetCommand } from "./set";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when keys are found", () => {
  test("returns keys", async () => {
    const key = newKey();
    await new SetCommand([key, "value"]).exec(client);
    const res = await new KeysCommand([key]).exec(client);
    expect(res).toEqual([key]);
  });
});
