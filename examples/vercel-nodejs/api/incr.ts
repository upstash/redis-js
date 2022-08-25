import { Redis } from "@upstash/redis/with-fetch";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const redis = Redis.fromEnv();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = ["vercel", "nodejs"].join("_");

  const count = await redis.incr(key);
  res.send(JSON.stringify({ count }));
}
