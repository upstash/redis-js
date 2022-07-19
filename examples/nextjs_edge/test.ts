import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async (t) => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/api/counter`;
  setTimeout(() => {
    console.error("manual timeout");
    Deno.exit(1);
  }, 5000);

  const res = await fetch(url);
  assertEquals(res.status, 200);
  const counterString = res.headers.get("Counter");
  assertEquals(typeof counterString, "string");
  const counter = parseInt(counterString!);
  assertEquals(true, counter > 0);
});
