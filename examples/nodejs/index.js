import dotenv from "dotenv";
import { Redis } from "@upstash/redis";

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  // automaticDeserialization: false
});
(async function run() {
  const res1 = await redis.set("node", '{"hello":"world"}');
  console.log(res1);

  const res2 = await redis.get("node");
  console.log(typeof res2, res2);
})();
