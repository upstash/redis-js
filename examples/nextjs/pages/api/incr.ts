import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const redis = Redis.fromEnv();

  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = ["vercel", process.env.VERCEL_GIT_COMMIT_SHA, "nextjs"].join("_");
  const count = await redis.createScript("return redis.incr(ARGV[1]);").exec([
    key,
  ], []);
  res.json({ count });
}
