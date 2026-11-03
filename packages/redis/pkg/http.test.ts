import { describe, test, expect } from "bun:test";
import { Redis } from "../platforms/nodejs";
import { serve } from "bun";
import { UpstashJSONParseError } from "./error";
import { HttpClient } from "./http";

const MOCK_SERVER_PORT = 8080;
const SERVER_URL = `http://localhost:${MOCK_SERVER_PORT}`;

/**
 * Replaces global fetch with one that throws `failures` times before succeeding and
 * records the headers of every attempt.
 */
const withMockFetch = async (
  failures: number,
  run: (calls: Record<string, string>[]) => Promise<void>
) => {
  const calls: Record<string, string>[] = [];
  const originalFetch = globalThis.fetch;
  let attempt = 0;
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    // copy headers since the same object is mutated between attempts
    calls.push({ ...(init?.headers as Record<string, string>) });
    if (attempt++ < failures) {
      throw new Error("simulated network error");
    }
    return new Response(JSON.stringify({ result: "OK" }), { status: 200 });
  }) as typeof fetch;
  try {
    await run(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
};

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

  test("should throw UpstashJSONParseError on non-JSON success response", async () => {
    const server = serve({
      async fetch() {
        return new Response("OK-PLAIN", {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
      port: MOCK_SERVER_PORT,
    });

    const redis = new Redis({
      url: SERVER_URL,
      token: "non-existent",
      enableAutoPipelining: false,
    });

    try {
      await expect(redis.get("foo")).rejects.toThrow(UpstashJSONParseError);
    } finally {
      server.stop(true);
    }
  });

  test("should throw UpstashJSONParseError on non-JSON error response", async () => {
    const body =
      "This is a very long error message that contains detailed information about what went wrong during the request. It includes stack traces, debugging information, and other relevant details that help developers understand the issue. This message is intentionally made longer than 200 characters to test the truncation functionality in the UpstashJSONParseError class. The truncation should show only the first 200 characters followed by three dots.";
    const server = serve({
      async fetch() {
        return new Response(body, {
          status: 500,
          headers: { "content-type": "text/plain" },
        });
      },
      port: MOCK_SERVER_PORT,
    });

    const redis = new Redis({
      url: SERVER_URL,
      token: "non-existent",
      enableAutoPipelining: false,
    });

    try {
      const error = await redis.get("foo").catch((error_) => error_);
      expect(error).toBeInstanceOf(UpstashJSONParseError);

      const { message, cause } = error as UpstashJSONParseError;
      const truncatedBody = body.length > 200 ? body.slice(0, 200) + "..." : body;
      expect(message).toContain(`Unable to parse response body: ${truncatedBody}`);
      expect(cause).toBeDefined();
    } finally {
      server.stop(true);
    }
  });

  test("should parse JSON success response", async () => {
    const server = serve({
      async fetch() {
        return new Response(JSON.stringify({ result: "json-ok" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
      port: MOCK_SERVER_PORT,
    });

    const redis = new Redis({
      url: SERVER_URL,
      token: "non-existent",
      enableAutoPipelining: false,
    });

    try {
      await expect(redis.get("foo")).resolves.toBe("json-ok");
    } finally {
      server.stop(true);
    }
  });

  test("should handle streaming data split across two chunks", async () => {
    const receivedMessages: string[] = [];

    const server = serve({
      async fetch() {
        // Create a ReadableStream that sends a data line split across two chunks
        const stream = new ReadableStream({
          start(controller) {
            // First chunk: partial data line
            const encoder = new TextEncoder();
            controller.enqueue(encoder.encode('data: {"id":"msg1","co'));

            // Simulate a small delay between chunks
            setTimeout(() => {
              // Second chunk: rest of the data line plus newline
              controller.enqueue(encoder.encode('ntent":"hello"}\n'));

              // Send another complete message to verify buffer is properly cleared
              controller.enqueue(encoder.encode('data: {"id":"msg2","content":"world"}\n'));

              controller.close();
            }, 10);
          },
        });

        return new Response(stream, {
          status: 200,
          headers: { "content-type": "text/event-stream" },
        });
      },
      port: MOCK_SERVER_PORT,
    });

    const client = new HttpClient({
      baseUrl: SERVER_URL,
      headers: { authorization: "Bearer test-token" },
      retry: false,
    });

    try {
      // Make a request with event stream support
      await client.request({
        body: ["SUBSCRIBE", "test-channel"],
        headers: { Accept: "text/event-stream" },
        onMessage: (data) => {
          receivedMessages.push(data);
        },
        isStreaming: true,
      });

      // Wait for the stream to process both chunks
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify that both messages were received correctly
      expect(receivedMessages).toHaveLength(2);
      expect(receivedMessages[0]).toBe('{"id":"msg1","content":"hello"}');
      expect(receivedMessages[1]).toBe('{"id":"msg2","content":"world"}');
    } finally {
      server.stop(true);
    }
  });

  describe("mergeTelemetry", () => {
    test("appends distinct values", () => {
      const client = new HttpClient({
        baseUrl: SERVER_URL,
        headers: { authorization: "Bearer test-token" },
      });

      client.mergeTelemetry({ sdk: "@upstash/redis@1.0.0", runtime: "node@v20" });
      client.mergeTelemetry({ sdk: "@upstash/ratelimit@2.0.0" });

      expect(client.headers["Upstash-Telemetry-Sdk"]).toBe(
        "@upstash/redis@1.0.0,@upstash/ratelimit@2.0.0"
      );
      expect(client.headers["Upstash-Telemetry-Runtime"]).toBe("node@v20");
    });

    test("does not duplicate values on repeated calls", () => {
      const client = new HttpClient({
        baseUrl: SERVER_URL,
        headers: { authorization: "Bearer test-token" },
      });

      client.mergeTelemetry({ sdk: "@upstash/redis@1.0.0", platform: "vercel" });
      client.mergeTelemetry({ sdk: "@upstash/ratelimit@2.0.0" });
      client.mergeTelemetry({ sdk: "@upstash/ratelimit@2.0.0", platform: "vercel" });

      expect(client.headers["Upstash-Telemetry-Sdk"]).toBe(
        "@upstash/redis@1.0.0,@upstash/ratelimit@2.0.0"
      );
      expect(client.headers["Upstash-Telemetry-Platform"]).toBe("vercel");
    });

    test("keeps distinct versions of the same sdk", () => {
      const client = new HttpClient({
        baseUrl: SERVER_URL,
        headers: { authorization: "Bearer test-token" },
      });

      client.mergeTelemetry({ sdk: "@upstash/redis@1.0.0" });
      client.mergeTelemetry({ sdk: "@upstash/redis@1.1.0" });

      expect(client.headers["Upstash-Telemetry-Sdk"]).toBe(
        "@upstash/redis@1.0.0,@upstash/redis@1.1.0"
      );
    });

    test("ignores whitespace around existing values", () => {
      const client = new HttpClient({
        baseUrl: SERVER_URL,
        headers: { authorization: "Bearer test-token", "Upstash-Telemetry-Sdk": "sdk-a, sdk-b" },
      });

      client.mergeTelemetry({ sdk: "sdk-b" });

      expect(client.headers["Upstash-Telemetry-Sdk"]).toBe("sdk-a, sdk-b");
    });
  });

  describe("retry configuration", () => {
    test.each([false, { retries: 0 }])(
      "does not retry a network failure with retry: %j",
      async (retry) => {
        await withMockFetch(1, async (calls) => {
          const client = new HttpClient({
            baseUrl: SERVER_URL,
            headers: { authorization: "Bearer test-token" },
            retry,
          });

          await expect(client.request({ body: ["get", "foo"] })).rejects.toThrow(
            "simulated network error"
          );
          expect(calls).toHaveLength(1);
        });
      }
    );

    test("allows the initial request when retries are disabled", async () => {
      await withMockFetch(0, async (calls) => {
        const client = new HttpClient({
          baseUrl: SERVER_URL,
          headers: { authorization: "Bearer test-token" },
          retry: false,
        });

        expect(await client.request({ body: ["get", "foo"] })).toEqual({ result: "OK" });
        expect(calls).toHaveLength(1);
      });
    });

    test.each(["direct", "auto-pipeline", "pipeline", "transaction"])(
      "does not replay a committed %s write after a lost response when retry is false",
      async (mode) => {
        const originalFetch = globalThis.fetch;
        const lostResponse = new Error("response lost after commit");
        let attempts = 0;
        let counter = 0;
        const events: string[] = [];

        globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
          attempts += 1;
          const body = JSON.parse(init?.body as string) as string[] | string[][];
          const commands = Array.isArray(body[0]) ? (body as string[][]) : [body as string[]];
          const results = commands.map(([command, key, value]) => {
            if (command === "incr" && key === "usage") {
              return { result: ++counter };
            }
            if (command === "lpush" && key === "events") {
              return { result: events.unshift(value) };
            }
            throw new Error(`Unexpected command: ${command}`);
          });

          if (attempts === 1) {
            throw lostResponse;
          }
          return new Response(JSON.stringify(mode === "direct" ? results[0] : results));
        }) as typeof fetch;

        try {
          const redis = new Redis({
            url: SERVER_URL,
            token: "test-token",
            enableTelemetry: false,
            enableAutoPipelining: mode === "auto-pipeline",
            retry: false,
          });
          const request =
            mode === "direct"
              ? redis.incr("usage")
              : mode === "auto-pipeline"
                ? Promise.all([redis.incr("usage"), redis.lpush("events", "visit")])
                : mode === "pipeline"
                  ? redis.pipeline().incr("usage").lpush("events", "visit").exec()
                  : redis.multi().incr("usage").lpush("events", "visit").exec();

          expect(await Promise.allSettled([request])).toEqual([
            { status: "rejected", reason: lostResponse },
          ]);
          expect(attempts).toBe(1);
          expect(counter).toBe(1);
          expect(events).toEqual(mode === "direct" ? [] : ["visit"]);
        } finally {
          globalThis.fetch = originalFetch;
        }
      }
    );
  });

  describe("retry telemetry", () => {
    test("sends Upstash-Telemetry-Retry only on retried attempts", async () => {
      await withMockFetch(2, async (calls) => {
        const client = new HttpClient({
          baseUrl: SERVER_URL,
          headers: { authorization: "Bearer test-token" },
          retry: { retries: 3, backoff: () => 0 },
        });
        client.mergeTelemetry({ sdk: "@upstash/redis@1.0.0" });

        const res = await client.request({ body: ["get", "foo"] });
        expect(res.result).toBe("OK");
        expect(calls).toHaveLength(3);
        expect(calls[0]["Upstash-Telemetry-Retry"]).toBeUndefined();
        expect(calls[1]["Upstash-Telemetry-Retry"]).toBe("1");
        expect(calls[2]["Upstash-Telemetry-Retry"]).toBe("2");

        // the retry counter must not leak into the client's shared headers or the next request
        expect(client.headers["Upstash-Telemetry-Retry"]).toBeUndefined();
        await client.request({ body: ["get", "foo"] });
        expect(calls).toHaveLength(4);
        expect(calls[3]["Upstash-Telemetry-Retry"]).toBeUndefined();
      });
    });

    test("does not send Upstash-Telemetry-Retry when telemetry is disabled", async () => {
      await withMockFetch(1, async (calls) => {
        const client = new HttpClient({
          baseUrl: SERVER_URL,
          headers: { authorization: "Bearer test-token" },
          retry: { retries: 2, backoff: () => 0 },
        });

        const res = await client.request({ body: ["get", "foo"] });
        expect(res.result).toBe("OK");
        expect(calls).toHaveLength(2);
        for (const headers of calls) {
          expect(headers["Upstash-Telemetry-Retry"]).toBeUndefined();
        }
      });
    });

    test("is sent by the Redis client together with the other telemetry headers", async () => {
      await withMockFetch(1, async (calls) => {
        const redis = new Redis({
          url: SERVER_URL,
          token: "test-token",
          enableAutoPipelining: false,
          retry: { retries: 2, backoff: () => 0 },
        });

        expect(await redis.get("foo")).toBe("OK");
        expect(calls).toHaveLength(2);
        expect(calls[0]["Upstash-Telemetry-Sdk"]).toStartWith("@upstash/redis@");
        expect(calls[0]["Upstash-Telemetry-Retry"]).toBeUndefined();
        expect(calls[1]["Upstash-Telemetry-Sdk"]).toStartWith("@upstash/redis@");
        expect(calls[1]["Upstash-Telemetry-Retry"]).toBe("1");
      });
    });

    test("is not sent by the Redis client when enableTelemetry is false", async () => {
      await withMockFetch(1, async (calls) => {
        const redis = new Redis({
          url: SERVER_URL,
          token: "test-token",
          enableTelemetry: false,
          enableAutoPipelining: false,
          retry: { retries: 2, backoff: () => 0 },
        });

        expect(await redis.get("foo")).toBe("OK");
        expect(calls).toHaveLength(2);
        for (const headers of calls) {
          expect(Object.keys(headers).filter((h) => h.startsWith("Upstash-Telemetry-"))).toEqual(
            []
          );
        }
      });
    });
  });
});

const abortedClient = (reason?: unknown) => {
  const controller = new AbortController();
  controller.abort(reason);
  return new Redis({
    url: SERVER_URL,
    token: "test-token",
    signal: controller.signal,
    enableAutoPipelining: false,
  });
};

describe("static abort signal", () => {
  test("returns null when aborted without a reason", async () => {
    expect(await abortedClient().get("foo")).toBeNull();
  });

  test("returns the reason when aborted with a string reason", async () => {
    expect(await abortedClient("Abort works!").get("foo")).toBe("Abort works!");
  });

  test("returns the reason when aborted with a numeric reason", async () => {
    expect(await abortedClient(5).get<number>("foo")).toBe(5);
  });

  test("returns null when aborted with an error reason", async () => {
    expect(await abortedClient(new Error("boom")).get("foo")).toBeNull();
  });

  test("returns the reason when aborted with an object reason", async () => {
    expect(await abortedClient({ a: 1 }).get("foo")).toEqual({ a: 1 });
  });
});
