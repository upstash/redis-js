import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const getServerSideProps = (async () => {
  const count = await redis.incr("counter");
  return { props: { count } }
}) satisfies GetServerSideProps<{ count: number }>

export default function Home({
  count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Counter: {count}</h1>
    </div>
  )
}
