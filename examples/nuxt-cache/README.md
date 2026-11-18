# Nuxt Self-Hosted Caching with Upstash Redis

Nitro, the server engine behind Nuxt, stores everything its caching helpers produce in a storage mount called
`cache`. On the Node.js server preset that mount lives in memory or on the local filesystem, so every server
instance has its own cache. When you self-host several instances behind a load balancer, a value cached on one
instance is a cache miss on the next.

This example points the `cache` mount at Upstash Redis with the
[unstorage `upstash` driver](https://unstorage.unjs.io/drivers/upstash), so every instance shares one cache. The
caching code itself is plain Nitro and does not change.

It shows:

- `nuxt.config.ts`: the `cache` mount on Upstash Redis for production (`storage`) and development (`devStorage`,
  with a separate key prefix), and an `swr` route rule for `/api/leaderboard`.
- `server/utils/products.ts`: a `defineCachedFunction` product lookup with a stable key (`name` + `getKey`).
  It waits two seconds to stand in for a slow query and returns the process ID (`computedBy`) and time
  (`computedAt`) so you can see which instance computed the value.
- `server/api/products/[id].get.ts`: a route that returns the cached product.
- `server/api/products/[id].delete.ts`: invalidates one product by removing its key from the `cache` storage.
  Because the storage is Redis, this applies to every instance. Protect a route like this in a real app.
- `server/api/stats.get.ts`: a whole response cached with `defineCachedEventHandler`.

The full guide is at
[Self-hosted caching in Nuxt and Nitro with Upstash Redis](https://upstash.com/docs/redis/tutorials/nuxt_nitro_caching).

## Requirements

- Node.js 22.21 or later (required by Nuxt 4.6).
- An Upstash Redis database.

## Project Setup

Clone the example and install dependencies:

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/nuxt-cache
npm install
```

## Database Setup

Create a Redis database using the [Upstash Console](https://console.upstash.com) or
[Upstash CLI](https://github.com/upstash/cli), and copy `.env.example` to `.env` with the REST URL and token:

```shell
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

This example uses the REST API over HTTP. Upstash Redis also accepts regular Redis clients over TCP with a
`rediss://` URL, which unstorage's `redis` driver can use instead.

The `upstash` driver reads these variables when the server starts. Don't put them in `nuxt.config.ts`: the storage
config is evaluated at build time and copied into `.output`.

## Build and Run Two Instances

```shell
npm run build
```

Start two servers on different ports, each in its own terminal:

```shell
PORT=3000 node --env-file=.env .output/server/index.mjs
PORT=3001 node --env-file=.env .output/server/index.mjs
```

`npm run dev` also works and uses Redis through `devStorage`, with keys under `my-app-dev:` instead of `my-app:`.

## Verify the Shared Cache

Request the same product from both instances. The first call takes about two seconds and is computed by the
instance on port 3000. The second call is answered by the instance on port 3001 straight from Redis, with the same
`computedAt` and the first instance's process ID:

```shell
curl http://localhost:3000/api/products/42
# {"id":"42","name":"Product 42","computedAt":"2026-11-18T12:41:31.196Z","computedBy":56032}

curl http://localhost:3001/api/products/42
# {"id":"42","name":"Product 42","computedAt":"2026-11-18T12:41:31.196Z","computedBy":56032}
```

The entry is stored in Redis as `my-app:nitro:functions:product:42.json`. You can see it in the Data Browser of the
Upstash Console.

Invalidate it through the first instance, then ask the second one again. It recomputes the value, and its own
process ID shows up in `computedBy`:

```shell
curl -X DELETE http://localhost:3000/api/products/42
# {"invalidated":"42"}

curl http://localhost:3001/api/products/42
# {"id":"42","name":"Product 42","computedAt":"2026-11-18T12:41:41.263Z","computedBy":56034}
```

`/api/stats` (cached event handler) and `/api/leaderboard` (`swr` route rule) behave the same way: after the first
request, both instances return the same `computedAt` and `computedBy`.
