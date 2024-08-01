import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { Config } from "sst/node/config";

const redis = new Redis({
  url: Config.UPSTASH_REDIS_REST_URL,
  token: Config.UPSTASH_REDIS_REST_TOKEN,
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const count = await redis.incr("counter");
  res.status(200).json({ count });
}