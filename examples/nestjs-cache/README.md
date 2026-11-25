# NestJS cache shared across instances with Upstash Redis

A NestJS 12 API that stores its cache in Upstash Redis through `@nestjs/cache-manager`.

By default, `@nestjs/cache-manager` keeps entries in memory. That works for a single process, but as
soon as the API runs on more than one instance (containers behind a load balancer, several replicas on
Railway, Render, Fly.io or Kubernetes), every instance has its own cold cache: a value cached by one
instance is computed again by the next, deleting a key on one instance leaves stale copies on the
others, and the cache is lost on every restart or deploy. With Redis as the store, every instance
reads and writes the same cache.

The example shows:

- `CacheModule.registerAsync` with a Redis store, a key namespace (`my-api`) and a default TTL
  ([src/app.module.ts](src/app.module.ts))
- `CacheInterceptor` with `@CacheKey()` and `@CacheTTL()` on `GET /products`
  ([src/products/products.controller.ts](src/products/products.controller.ts))
- Cache-aside with `CACHE_MANAGER` (`get`, `set`, `del`) on `GET /products/:id`, and invalidation on
  `PATCH /products/:id` ([src/products/products.service.ts](src/products/products.service.ts))

A full walkthrough is in the
[Caching in NestJS with Upstash Redis](https://upstash.com/docs/redis/tutorials/nestjs_caching) tutorial.

## Why `@keyv/redis` over TCP

`@nestjs/cache-manager` uses [cache-manager](https://github.com/jaredwray/cacheable/tree/main/packages/cache-manager),
which stores data through [Keyv](https://keyv.org) adapters. `@keyv/redis` is the Redis store the
NestJS documentation uses. It keeps a TCP connection open to Upstash, which suits a long-running Nest
server. If your environment cannot open outbound TCP connections, see
[Using the REST API instead of TCP](https://upstash.com/docs/redis/tutorials/nestjs_caching#using-the-rest-api-instead-of-tcp)
for an HTTP-based adapter.

## Requirements

- Node.js 22.19 or newer (required by `@keyv/redis` 6)

## Setup

Install dependencies:

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/nestjs-cache
npm install
```

Create a Redis database in the [Upstash Console](https://console.upstash.com/redis) or with the
[Upstash CLI](https://github.com/upstash/cli). On the database page, open **Connect**, choose the
**TCP** tab and copy the Redis URL. It starts with `rediss://` because Upstash requires TLS. Copy
`.env.example` to `.env` and set it:

```shell
cp .env.example .env
```

```shell
REDIS_URL=rediss://default:<password>@<endpoint>:6379
ADMIN_TOKEN=<A_LONG_RANDOM_STRING>
```

`ADMIN_TOKEN` stands in for real auth on the `PATCH` route.

## Build and run

```shell
npm run build
```

Start two instances on different ports:

```shell
PORT=3000 node --env-file=.env dist/main.js &
PORT=3001 node --env-file=.env dist/main.js &
```

`npm start` runs a single instance on port 3000.

## Verify

`loadFromDatabase()` simulates a slow query (about one second) and records when and by which process
the value was loaded (`loadedAt`, `loadedBy`).

**Shared value.** Request the same product from both instances. The first request takes about a
second. The second instance answers from Redis with the same `loadedAt` and the process ID of the
first instance in `loadedBy`:

```shell
curl localhost:3000/products/42
# {"id":"42","name":"Product 42","price":420,"loadedAt":"2026-11-18T12:46:54.257Z","loadedBy":60570}

curl localhost:3001/products/42
# {"id":"42","name":"Product 42","price":420,"loadedAt":"2026-11-18T12:46:54.257Z","loadedBy":60570}
```

The key is stored with the namespace prefix, `my-api::product:42`, and expires after 5 minutes. You
can inspect it in the Data Browser of the Upstash Console or with `redis-cli`:

```shell
redis-cli --tls -u "$REDIS_URL" PTTL my-api::product:42
```

**TTL expiry.** `GET /products` is cached by `CacheInterceptor` under `products:all` for 10 seconds.
A request on one instance is served from the cache on the other; after 10 seconds the key expires in
Redis and the next request loads the list again with a new `loadedAt`:

```shell
curl localhost:3000/products
curl localhost:3001/products   # same loadedAt values
sleep 11
curl localhost:3001/products   # new loadedAt values
```

**Invalidation.** Update the product on the first instance. It deletes `product:42` and
`products:all`, so the second instance misses the cache and loads the product again:

```shell
curl -X PATCH localhost:3000/products/42 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":99}'

curl localhost:3001/products/42
# {"id":"42","name":"Product 42","price":420,"loadedAt":"2026-11-18T12:46:58.057Z","loadedBy":60572}
```

The example does not have a real database, so the price stays the same; what changes is `loadedAt` and
`loadedBy`.

Stop both instances with `kill %1 %2`.
