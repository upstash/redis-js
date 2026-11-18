import { test, expect } from "bun:test";

const deploymentURL = process.env.DEPLOYMENT_URL;
if (!deploymentURL) {
  throw new Error("DEPLOYMENT_URL not set");
}

const ATTEMPTS = 5;

test(
  "works",
  async () => {
    console.log({ deploymentURL });

    // The first requests after a deploy can be slow, so retry a few times.
    let status: number | undefined;
    let body = "";
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
      status = undefined;
      try {
        const res = await fetch(deploymentURL, { signal: AbortSignal.timeout(10_000) });
        status = res.status;
        body = await res.text();
        console.log({ attempt, status, body });
        if (status === 200) break;
      } catch (error) {
        console.log({ attempt, error: String(error) });
      }
      if (attempt < ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    expect(status).toBe(200);
    const json = JSON.parse(body) as { counter: number };
    expect(typeof json.counter).toBe("number");
  },
  { timeout: 70_000 }
);
