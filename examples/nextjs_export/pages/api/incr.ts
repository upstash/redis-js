import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "lib/redis";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = ["vercel", process.env.VERCEL_GIT_COMMIT_SHA, "nextjs"].join("_");
  const count = await redis.incr(key);
  res.json({ count });
}
