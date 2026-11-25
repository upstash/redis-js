# Self-hosted Next.js cache with Upstash Redis

When you self-host Next.js (`next start`, a Docker image, Kubernetes, Railway,
Render, Fly.io), every instance keeps its own cache in memory and on its local
disk. With two or more instances behind a load balancer, each one computes the
same value again, and `revalidateTag()` on one instance does not reach the
others.

This example plugs a cache handler backed by Upstash Redis into Next.js 16, so
every instance reads and writes the same cache and tag revalidation reaches all
of them.

- [`cache-handler.js`](./cache-handler.js) is the `"use cache: remote"` handler,
  registered under `cacheHandlers.remote` in [`next.config.ts`](./next.config.ts).
- [`app/page.tsx`](./app/page.tsx) caches a slow function with
  `"use cache: remote"`, `cacheTag("posts")` and `cacheLife` (30 seconds). It
  shows the `pid` of the instance that computed the value and of the one that
  served the page.
- [`app/api/revalidate/route.ts`](./app/api/revalidate/route.ts) calls
  `revalidateTag("posts", { expire: 0 })`. It only accepts requests that send
  `CACHE_ADMIN_TOKEN` as a bearer token.
- `output: "standalone"` produces a self-contained server in `.next/standalone`,
  the usual way to ship Next.js in a container.

The full walkthrough, including a handler for ISR, the `fetch` cache and
`unstable_cache`, is in the
[Self-hosted Next.js caching tutorial](https://upstash.com/docs/redis/tutorials/nextjs_self_hosted_caching).

## Setup

Create a Redis database in the [Upstash Console](https://console.upstash.com)
and copy its REST URL and token into `.env`. This example uses the REST API over
HTTP through `@upstash/redis`; Upstash Redis also accepts regular Redis clients
over TCP with a `rediss://` URL if you prefer one.

```shell
cp .env.example .env
```

```shell .env
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
CACHE_ADMIN_TOKEN=<A_LONG_RANDOM_STRING>
```

Install and build:

```shell
npm install
npm run build
```

`npm run build` runs `next build` and copies `.next/static` into the standalone
output. Next.js copies `.env` there too.

## Run two instances

```shell
PORT=3000 npm start
PORT=3001 npm start   # in a second terminal
```

`npm start` runs `node .next/standalone/server.js`.

## Verify

This helper prints the cached value from a page:

```shell
show() { curl -s "localhost:$1" | grep -o '{&quot;generatedAt[^<]*' | sed 's/&quot;/"/g'; }
```

1. **Shared cache.** The first request takes about two seconds. The second
   instance returns at once with the same `generatedAt` and `pid`, computed by
   the first instance:

   ```shell
   show 3000
   show 3001
   ```

2. **Revalidation across instances.** Invalidate the tag on one instance and
   load the other. It computes a new value instead of serving the old one, and
   the first instance then shares it:

   ```shell
   curl -X POST localhost:3000/api/revalidate \
     -H "Authorization: Bearer $CACHE_ADMIN_TOKEN"
   show 3001
   show 3000
   ```

3. **Expiry.** Wait 30 seconds and reload either port. The entry has expired in
   Redis, so the page takes two seconds again and shows a new `generatedAt`.

In the Data Browser of the Upstash Console you will see one `next:cache:*` key
per cached call and the `next:tags` hash with tag invalidation times.

## Deploying

Run the same build on every instance and pass `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN` as runtime environment variables. Keep `.env` out of
your image; the build copies it into `.next/standalone`.
