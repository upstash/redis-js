require("dotenv").config()
const { Redis } = require("@upstash/redis")

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

;(async function run() {
  const res1 = await redis.set("node", "23")
  console.log(res1)

  const res2 = await redis.get("node")
  console.log(res2)
})()
