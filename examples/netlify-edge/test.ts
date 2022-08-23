import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/handler`;
  console.log({ url });
  const res = await fetch(url);
  const body = await res.text();
  console.log({ body });
  assertEquals(res.status, 200);
  const json = JSON.parse(body) as { counter: number };
  assertEquals(typeof json.counter, "number");
});
