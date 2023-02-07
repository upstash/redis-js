import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async () => {
  console.log({ deploymentURL });
  const res = await fetch(deploymentURL);
  const body = await res.text();
  console.log({ body });
  assertEquals(res.status, 200);
  const json = JSON.parse(body) as { counter: number };
  assertEquals(typeof json.counter, "number");
});
