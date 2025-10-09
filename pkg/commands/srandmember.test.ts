import { keygen, newHttpClient, randomID } from "../test-utils";

import { afterAll, expect, test, describe } from "bun:test";
import { SAddCommand } from "./sadd";
import { SRandMemberCommand } from "./srandmember";

const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);

describe("without opts", () => {
  test("returns a random key", async () => {
    const key = newKey();
    const member = randomID();
    await new SAddCommand([key, member]).exec(client);
    const res = await new SRandMemberCommand([key]).exec(client);
    expect(res).toEqual(member);
  });
});

describe("with count", () => {
  test("returns a random key", async () => {
    const key = newKey();
    const member1 = randomID();
    const member2 = randomID();
    await new SAddCommand([key, member1, member2]).exec(client);
    const res = await new SRandMemberCommand<unknown[]>([key, 2]).exec(client);
    expect(res?.length).toBe(2);
  });
});
