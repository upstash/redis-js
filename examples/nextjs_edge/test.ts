import { expect } from "https://deno.land/std/testing/asserts";

const deploymentURL = Deno.env.get("DEPLOYMENT_URL");
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  const url = `${deploymentURL}/api/counter`;
  console.log({ url });

  const res = await fetch(url);
  expect(res.status, 200);
  const { counter } = (await res.json()) as { counter: number };
  expect("number", typeof counter);
});
