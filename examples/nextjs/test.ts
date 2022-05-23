import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const host = Deno.args[0];

Deno.test("works", async () => {
  console.log({ host });
  const url = `https://${host}/api`;
  const res = await fetch(url);
  assertEquals(res.status, 200);
  const json = (await res.json()) as { value: number };
  assertEquals(json.value, 1);
});
