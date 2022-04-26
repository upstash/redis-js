import { keygen } from "./test-utils";
import { afterEach, describe, expect, it } from "@jest/globals";
import { randomUUID } from "crypto";
import { Redis, Requester, UpstashRequest, UpstashResponse } from "./nodejs";

const { newKey, cleanup } = keygen();
afterEach(cleanup);

describe(
  "with custom requester implementation",
  () => {
    it(
      "works",
      async () => {
        let state = "";

        const requester: Requester = {
          request: <TResult>(req: UpstashRequest): Promise<
            UpstashResponse<TResult>
          > => {
            state = JSON.stringify(req.body);
            return Promise.resolve(
              { result: "success" as unknown as TResult } as UpstashResponse<
                TResult
              >,
            );
          },
        };

        const key = newKey();
        const value = randomUUID();

        const redis = new Redis(requester);
        const res = await redis.set(key, value);
        expect(res).toEqual("success");

        expect(state).toEqual(`["set","${key}","${value}"]`);
      },
    );
  },
);
