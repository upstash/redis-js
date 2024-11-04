import { describe, test, expect } from "bun:test";
import { Redis } from "../platforms/nodejs";

describe("http", () => {
  test("should terminate after sleeping 5 times", async () => {
    // init a cient which will always get errors
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: "non-existent",
      // set retry explicitly
      retry: {
        retries: 5,
        backoff: (retryCount) => Math.exp(retryCount) * 50,
      },
    });

    // get should take 4.287 seconds and terminate before the timeout.
    const throws = () => Promise.race([redis.get("foo"), new Promise((r) => setTimeout(r, 4500))]);

    // if the Promise.race doesn't throw, that means the retries took longer than 4.5s
    expect(throws).toThrow("fetch() URL is invalid");
  });
});
