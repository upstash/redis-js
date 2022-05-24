import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

Deno.test("works", async () => {
  console.log({ deploymentURL });
  const res = await fetch(deploymentURL);
  assertEquals(res.status, 200);
  const json = (await res.json()) as { count: number };
  assertEquals(typeof json.count, "number");
});
