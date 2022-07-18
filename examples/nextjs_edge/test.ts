import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/api`;
  const res = await fetch(url);
  assertEquals(res.status, 200);
  const counterString = res.headers.get("Counter");
  assertEquals(typeof counterString, "string");
  const counter = parseInt(counterString!);

  assertEquals(counter, "number");
  assertEquals(true, counter > 0);
});
