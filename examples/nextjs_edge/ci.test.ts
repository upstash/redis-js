import {test,expect} from "bun:test"
const deploymentURL = process.env.DEPLOYMENT_URL;
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  const url = `${deploymentURL}/api/counter`;
  console.log({ url });

  const res = await fetch(url);
  expect(res.status).toEqual(200);
  const { counter } = (await res.json()) as { counter: number };
  expect(typeof counter).toEqual("number");
});
