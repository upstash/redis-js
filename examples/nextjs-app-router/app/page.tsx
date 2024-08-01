import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function Home() {
  const count = await redis.incr("counter");
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Counter: {count}</h1>
    </div>
  )
}
