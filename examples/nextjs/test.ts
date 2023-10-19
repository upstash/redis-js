import { expect } from "https://deno.land/std/testing/asserts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/api/incr`;
  const res = await fetch(url);
  expect(res.status, 200);
  const json = (await res.json()) as { count: number };
  expect(typeof json.count, "number");
});
