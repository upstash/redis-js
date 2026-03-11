import { keygen, newHttpClient, randomID } from "../test-utils";

import { SAddCommand } from "./sadd";
import { SMIsMemberCommand } from "./smismember";

import { afterAll, expect, test, describe } from "bun:test";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("when member exists", () => {
  test("returns 1", async () => {
    const key = newKey();
    const value1 = randomID();
    const value2 = randomID();
    await new SAddCommand([key, value1]).exec(client);
    await new SAddCommand([key, value2]).exec(client);
    const res = await new SMIsMemberCommand([key, [value1, randomID()]]).exec(client);
    expect(res).toEqual([1, 0]);
  });
});
