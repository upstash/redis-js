import { expect } from "https://deno.land/std/testing/asserts";

const deploymentURL = process.env.DEPLOYMENT_URL;
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  console.log({ deploymentURL });
  const res = await fetch(deploymentURL);
  expect(res.status, 200);
  const json = (await res.json()) as { count: number };
  expect(typeof json.count, "number");
});
