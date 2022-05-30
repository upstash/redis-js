import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/`;
  const res = await fetch(url);
  assertEquals(res.status, 200);
  const json = (await res.json()) as { count: number };
  assertEquals(typeof json.count, "number");
});
