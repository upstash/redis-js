import { Suspense } from "react";
import { connection } from "next/server";
import { cacheLife, cacheTag } from "next/cache";

async function getPosts() {
  "use cache: remote";
  cacheTag("posts");
  cacheLife({ stale: 30, revalidate: 30, expire: 30 });

  // Stand-in for a slow database query
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // pid shows which instance computed the value
  return { generatedAt: new Date().toISOString(), pid: process.pid };
}

async function Posts() {
  await connection(); // render at request time
  const posts = await getPosts();
  return (
    <>
      <pre id="posts">{JSON.stringify(posts)}</pre>
      <p>Served by pid {process.pid}</p>
    </>
  );
}

export default function Page() {
  return (
    <main>
      <h1>Shared &quot;use cache: remote&quot; with Upstash Redis</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Posts />
      </Suspense>
    </main>
  );
}
