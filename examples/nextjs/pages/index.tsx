import { useState } from "react";
import { Redis } from "@upstash/redis";

const Home = ({ count }: { count: number }) => {
  const [cacheCount, setCacheCount] = useState(count);

  const incr = async () => {
    const response = await fetch("/api/incr", { method: "GET" });
    const data = await response.json();
    setCacheCount(data.count);
  };

  const decr = async () => {
    const response = await fetch("/api/decr", { method: "GET" });
    const data = await response.json();
    setCacheCount(data.count);
  };
  return (
    <>
      <main>
        <header>
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-primary-500">@upstash/redis</span>
          </h1>

          <p className="mt-4">
            This is an example of how you can use Upstash redis in a nextjs
            application
          </p>
        </header>

        <hr className="my-10" />

        <div className="flex items-center justify-around">
          <div>
            <button onClick={incr}>Increment</button>
          </div>
          <div>
            <button onClick={decr}>Decrement</button>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <pre>{cacheCount}</pre>
        </div>
      </main>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const redis = Redis.fromEnv();

  const count = await redis.incr("nextjs");

  return { props: { count } };
}
