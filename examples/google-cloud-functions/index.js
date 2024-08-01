const { Redis } = require("@upstash/redis");
const functions = require('@google-cloud/functions-framework');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

functions.http('counter', async (req, res) => {
  const count = await redis.incr("counter");
  res.send("Counter:" + count);
});
