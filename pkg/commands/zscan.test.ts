import { keygen, newHttpClient } from "../test-utils.ts";
import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";
import {
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { ZAddCommand } from "./zadd.ts";
import { ZScanCommand } from "./zscan.ts";
const client = newHttpClient();

const { newKey, cleanup } = keygen();
afterAll(cleanup);
describe("without options", () => {
  it("returns cursor and members", async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    await new ZAddCommand(key, { score: 0, member: value }).exec(client);
    const res = await new ZScanCommand(key, 0).exec(client);

    assertEquals(res.length, 2);
    assertEquals(typeof res[0], "number");
    assertEquals(res![1].length > 0, true);
  });
});

describe("with match", () => {
  it("returns cursor and members", async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    await new ZAddCommand(key, { score: 0, member: value }).exec(client);
    const res = await new ZScanCommand(key, 0, { match: value }).exec(client);

    assertEquals(res.length, 2);
    assertEquals(typeof res[0], "number");
    assertEquals(res![1].length > 0, true);
  });
});

describe("with count", () => {
  it("returns cursor and members", async () => {
    const key = newKey();
    const value = crypto.randomUUID();
    await new ZAddCommand(key, { score: 0, member: value }).exec(client);
    const res = await new ZScanCommand(key, 0, { count: 1 }).exec(client);

    assertEquals(res.length, 2);
    assertEquals(typeof res[0], "number");
    assertEquals(res![1].length > 0, true);
  });
});
