import { expect } from "https://deno.land/std/testing/asserts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/.netlify/functions/handler`;
  console.log({ url });

  const res = await fetch(url);
  expect(res.status, 200);
  const json = (await res.json()) as { counter: number };
  expect(typeof json.counter, "number");
});
