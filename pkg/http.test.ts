import { describe, expect, test } from "bun:test";
import { HttpClient } from "./http";

import { newHttpClient } from "./test-utils";
import { UrlError } from "./error";
test("remove trailing slash from urls", () => {
  const client = new HttpClient({ baseUrl: "https://example.com/" });

  expect(client.baseUrl).toEqual("https://example.com");
});

describe(new URL("", import.meta.url).pathname, () => {
  describe("when the request is invalid", () => {
    test("throws", async () => {
      const client = newHttpClient();
      let hasThrown = false;
      await client.request({ body: ["get", "1", "2"] }).catch(() => {
        hasThrown = true;
      });
      expect(hasThrown).toBeTrue();
    });
  });

  describe("whithout authorization", () => {
    test("throws", async () => {
      const client = newHttpClient();
      client.headers = {};
      let hasThrown = false;
      await client.request({ body: ["get", "1", "2"] }).catch(() => {
        hasThrown = true;
      });
      expect(hasThrown).toBeTrue();
    });
  });
});

describe("Abort", () => {
  test("should abort the request", async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const client = newHttpClient();
    client.options.signal = signal;
    const body = client.request({
      body: ["set", "name", "hezarfen"],
    });
    controller.abort("Abort works!");

    expect((await body).result).toEqual("Abort works!");
  });
});

describe("should reject invalid urls", () => {
  test("should reject when https is missing", async () => {
    try {
      new HttpClient({baseUrl: "eu1-flying-whale-434343.upstash.io"})
    } catch (error) {
      expect(error instanceof UrlError).toBeTrue()
      return
    }
    throw new Error("Test error. Should have raised when initializing client")
  })

  test("should allow when http is used", async () => {
    new HttpClient({
      baseUrl: "http://eu1-flying-whale-434343.upstash.io",
    })
  })

  test("should allow when https is used", async () => {
    new HttpClient({
      baseUrl: "https://eu1-flying-whale-434343.upstash.io",
    })
  })
})