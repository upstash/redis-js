import { HttpClient } from "./http.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.141.0/testing/asserts.ts";

import { newHttpClient } from "./test-utils.ts";
Deno.test("remove trailing slash from urls", () => {
  const client = new HttpClient({ baseUrl: "https://example.com/" });

  assertEquals(client.baseUrl, "https://example.com");
});

Deno.test(new URL("", import.meta.url).pathname, async (t) => {
  await t.step("when the request is invalid", async (t) => {
    await t.step("throws", async () => {
      const client = newHttpClient();
      await assertRejects(() => client.request({ body: ["get", "1", "2"] }));
    });
  });

  await t.step("whithout authorization", async (t) => {
    await t.step("throws", async () => {
      const client = newHttpClient();
      client.headers = {};
      await assertRejects(() => client.request({ body: ["get", "1", "2"] }));
    });
  });
});
