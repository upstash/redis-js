import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const host = Deno.env.get("DEPLOYMENT_URL");
if (!host) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async () => {
  console.log({ host });
  const url = `https://${host}/api`;
  const res = await fetch(url);
  assertEquals(res.status, 200);
  const json = (await res.json()) as { value: number };
  assertEquals(json.value, 1);
});
