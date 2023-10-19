import { expect, test } from "bun:test";

const deploymentURL = process.env.DEPLOYMENT_URL;
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/`;
  const res = await fetch(url);
  if (res.status !== 200) {
    console.log(await res.text());
  }
  expect(res.status).toEqual(200);
  const json = (await res.json()) as { count: number };
  expect(typeof json.count).toEqual("number");
});
