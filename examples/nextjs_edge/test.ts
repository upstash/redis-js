import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async () => {
  const url = `${deploymentURL}/api/counter`;
  console.log({ url });

  const res = await fetch(url);
  assertEquals(res.status, 200);
  const counterString = res.headers.get("Counter");
  const counter = parseInt(counterString!);
  assertEquals(true, counter > 0);
  assertEquals("OK", await res.text());
});
