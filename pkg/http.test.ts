import { describe, test, expect } from "bun:test";
import { Redis } from "../platforms/nodejs";
import { serve } from "bun";

const MOCK_SERVER_PORT = 8080;
const SERVER_URL = `http://localhost:${MOCK_SERVER_PORT}`;

describe("http", () => {
  test("should terminate after sleeping 5 times", async () => {
    // init a cient which will always get errors
    const redis = new Redis({
      url: undefined,
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

  test("should throw on request timeouts", async () => {
    const server = serve({
      async fetch(request) {
        const body = await request.text();

        if (body.includes("zed")) {
          return new Response(JSON.stringify({ result: '"zed-result"' }), { status: 200 });
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        return new Response("Hello World");
      },
      port: MOCK_SERVER_PORT,
    });

    const redis = new Redis({
      url: SERVER_URL,
      token: "non-existent",
      signal: () => AbortSignal.timeout(1000), // set a timeout of 1 second
      // set to false since mock server doesn't return a response
      // for a pipeline. If you want to test pipelining, you can set it to true
      // and make the mock server return a pipeline response.
      enableAutoPipelining: false,
    });

    try {
      expect(redis.get("foo")).rejects.toThrow("The operation timed out.");
      expect(redis.get("bar")).rejects.toThrow("The operation timed out.");
      expect(redis.get("zed")).resolves.toBe("zed-result");
    } catch (error) {
      server.stop(true);
      throw error;
    } finally {
      server.stop(true);
    }

    try {
      await redis.get("foo");
      throw new Error("Expected to throw");
    } catch (error) {
      expect((error as Error).name).toBe("TimeoutError");
    }
  });
});
