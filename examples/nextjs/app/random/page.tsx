import { Redis } from "@upstash/redis";
const redis = Redis.fromEnv();
export default async function Page() {
  const size = await redis.scard("random");
  if (size === 0) {
    await redis.sadd("random", "Hello", "World", "Welcome", "to", "Upstash");
  }

  const random = await redis.srandmember<string>("random");

  return <div>{random}</div>;
}
