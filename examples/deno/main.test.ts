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
    let res: Response | undefined;
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
      try {
        res = await fetch(deploymentURL, { signal: AbortSignal.timeout(10_000) });
        if (res.status === 200) break;
        console.log({ attempt, status: res.status });
      } catch (error) {
        console.log({ attempt, error: String(error) });
      }
      if (attempt < ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    expect(res?.status).toBe(200);
    const body = await res!.text();
    console.log({ body });
    const json = JSON.parse(body) as { counter: number };
    expect(typeof json.counter).toBe("number");
  },
  { timeout: 70_000 }
);
