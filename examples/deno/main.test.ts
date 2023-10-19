const deploymentURL = process.env.DEPLOYMENT_URL;
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

test("works", async () => {
  console.log({ deploymentURL });
  const res = await fetch(deploymentURL);
  const body = await res.text();
  console.log({ body });
  expect(res.status, 200);
  const json = JSON.parse(body) as { counter: number };
  expect(typeof json.counter, "number");
});
