import { keygen } from "./test-utils.ts";
import {
  afterEach,
  describe,
  it,
} from "https://deno.land/std@0.136.0/testing/bdd.ts";

import { Redis, Requester, UpstashRequest, UpstashResponse } from "./nodejs.ts";

import { assertEquals } from "https://deno.land/std@0.136.0/testing/asserts.ts";

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe("with custom requester implementation", () => {
  it("works", async () => {
    let state = "";

    const requester: Requester = {
      request: <TResult>(
        req: UpstashRequest,
      ): Promise<UpstashResponse<TResult>> => {
        state = JSON.stringify(req.body);
        return Promise.resolve({
          result: "success" as unknown as TResult,
        } as UpstashResponse<TResult>);
      },
    };

    const key = newKey();
    const value = crypto.randomUUID();

    const redis = new Redis(requester);
    const res = await redis.set(key, value);
    assertEquals(res, "success");

    assertEquals(state, `["set","${key}","${value}"]`);
  });
});
