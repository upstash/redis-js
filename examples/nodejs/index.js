const { Redis } = require("@upstash/redis");

const redis = Redis.fromEnv();
async function run() {
  const key = "key";

  const res1 = await redis.set(key, '{"hello":"world"}');
  console.log(res1);

  const res2 = await redis.get(key);
  console.log(typeof res2, res2);
}

run();
