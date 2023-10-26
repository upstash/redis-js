import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";

const redis = Redis.fromEnv({ automaticDeserialization: true });

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = ["vercel", process.env.VERCEL_GIT_COMMIT_SHA || "local", "nextjs", "random"].join(
    "_",
  );
  await redis.set(key, `${Math.floor(Math.random() * 100)}_hello 😋`);
  const value = await redis.get(key);
  res.json({ key, value });
}
