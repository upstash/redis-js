import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {}, []);

  const generate = async () => {
    const res = await fetch("/api");

    if (res.ok) {
      setResponse({
        status: res.status,
        body: await res.json(),
      });
    } else {
      setResponse(null);
      alert(`Something went wrong. Status: ${res.status} ${res.statusText}`);
    }
  };
  return (
    <>
      <main>
        <header>
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-primary-500">@upstash/redis</span> @edge
          </h1>

          <p className="mt-4">
            This is an example of how use Upstash redis inside Vercel's edge middleware
          </p>

          <p className="mt-4">Click the button below to make a request to Increase the counter</p>
        </header>

        <hr className="my-10" />

        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-center">
            <button type="button" onClick={generate}>Incr</button>
          </div>

          {response ? <pre>{JSON.stringify(response, null, 2)}</pre> : null}
        </div>
      </main>
    </>
  );
};

export default Home;
