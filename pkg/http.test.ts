import { HttpClient } from "./http.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.136.0/testing/asserts.ts";

import { describe, it } from "https://deno.land/std@0.136.0/testing/bdd.ts";
import { newHttpClient } from "./test-utils.ts";
it("remove trailing slash from urls", () => {
  const client = new HttpClient({ baseUrl: "https://example.com/" });

  assertEquals(client.baseUrl, "https://example.com");
});

describe("when the request is invalid", () => {
  it("throws", async () => {
    const client = newHttpClient();
    await assertRejects(() => client.request({ body: ["get", "1", "2"] }));
  });
});

describe("whithout authorization", () => {
  it("throws", async () => {
    const client = newHttpClient();
    client.headers = {};
    await assertRejects(() => client.request({ body: ["get", "1", "2"] }));
  });
});
