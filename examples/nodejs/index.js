import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

async function run() {
  const key = "key";
  const value = { hello: "world" };

  const res1 = await redis.set(key, value);
  console.log(res1);

  const res2 = await redis.get(key);
  console.log(typeof res2, res2);

  if (JSON.stringify(value) != JSON.stringify(res2)) {
    throw new Error("value not equal");
  }
}

run();
