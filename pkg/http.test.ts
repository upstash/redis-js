import { describe, expect, test } from "bun:test";
import { HttpClient } from "./http";

import { newHttpClient } from "./test-utils";

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
    const body = client.request({
      body: ["set", "name", "hezarfen"],
      signal,
    });
    controller.abort("Abort works!");

    expect((await body).result).toEqual("Abort works!");
  });
});
