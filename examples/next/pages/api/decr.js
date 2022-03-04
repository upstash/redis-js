import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  try {
    const response = await redis.decr("nextjs")
    if (response.error) throw response.error
    res.status(200).json({ count: response.data })
  } catch (e) {
    res.status(400).json({ messages: e })
  }
}
