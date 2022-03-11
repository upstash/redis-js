require("dotenv").config()
const { Redis } = require("@upstash/redis")

const redis = Redis.fromEnv()

;(async function run() {
  const res1 = await redis.set("node", "23")
  console.log(res1)

  const res2 = await redis.get("node")
  console.log(res2)
})()
