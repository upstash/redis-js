import { expect, test } from "bun:test";

const deploymentURL = process.env.DEPLOYMENT_URL;
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/incr`;
  console.log({ url });
  const res = await fetch(url);
  const body = await res.text();
  console.log({ body });
  expect(res.status).toEqual(200);
  const json = JSON.parse(body) as { counter: number };
  expect(typeof json.counter).toEqual("number");
});
