import {test,expect} from "bun:test"
const deploymentURL = process.env.DEPLOYMENT_URL;
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  console.log({ deploymentURL });
  const url = `${deploymentURL}/api/hello`;
  const res = await fetch(url);
  expect(res.status).toEqual(200);
  const json = (await res.json()) as { count: number };
  expect(typeof json.count).toEqual("number");
});