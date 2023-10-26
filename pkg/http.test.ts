import { expect, test } from "bun:test";
import { HttpClient } from "./http";

import { newHttpClient } from "./test-utils";
test("remove trailing slash from urls", () => {
  const client = new HttpClient({ baseUrl: "https://example.com/" });

  expect(client.baseUrl).toEqual("https://example.com");
});

test(new URL("", import.meta.url).pathname, () => {
  test("when the request is invalid", () => {
    test("throws", async () => {
      const client = newHttpClient();
      let hasThrown = false;
      await client.request({ body: ["get", "1", "2"] }).catch(() => {
        hasThrown = true;
      });
      expect(hasThrown).toBeTrue();
    });
  });

  test("whithout authorization", () => {
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
