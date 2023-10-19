import { Redis } from "@upstash/redis";
import "isomorphic-fetch";

const redis = Redis.fromEnv();

export default async function handler(_req, res) {
  /**
   * We're prefixing the key for our automated tests.
   * This is to avoid collisions with other tests.
   */
  const key = ["vercel", process.env.VERCEL_GIT_COMMIT_SHA || "local", "nodejs"].join("_");
  await redis.set(key, `${Math.floor(Math.random() * 100)}_hello 😋`);
  const value = await redis.get(key);
  res.json({ key, value });
}
