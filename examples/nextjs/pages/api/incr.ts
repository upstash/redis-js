import https from "https";
import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
const agent = new https.Agent({ keepAlive: true });
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const redis = Redis.fromEnv({ agent });

  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = ["vercel", process.env.VERCEL_GIT_COMMIT_SHA, "nextjs"].join("_");

  const count = await redis.createScript("return redis.call('INCR', KEYS[1]);").exec([key], []);
  res.json({ count });
}
