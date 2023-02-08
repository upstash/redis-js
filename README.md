# Upstash Redis

`@upstash/redis` is an HTTP/REST based Redis client for typescript, built on top
of [Upstash REST API](https://docs.upstash.com/features/restapi).

[![Tests](https://github.com/upstash/upstash-redis/actions/workflows/tests.yaml/badge.svg)](https://github.com/upstash/upstash-redis/actions/workflows/tests.yaml)
![npm (scoped)](https://img.shields.io/npm/v/@upstash/redis)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@upstash/redis)

It is the only connectionless (HTTP based) Redis client and designed for:

- Serverless functions (AWS Lambda ...)
- Cloudflare Workers (see
  [the example](https://github.com/upstash/upstash-redis/tree/main/examples/cloudflare-workers))
- Fastly Compute@Edge (see
  [the example](https://github.com/upstash/upstash-redis/tree/main/examples/fastly))
- Next.js, Jamstack ...
- Client side web/mobile applications
- WebAssembly
- and other environments where HTTP is preferred over TCP.

See
[the list of APIs](https://docs.upstash.com/features/restapi#rest---redis-api-compatibility)
supported.

## Quick Start

### Install

#### Node.js

```bash
npm install @upstash/redis
```

#### Deno

```ts
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";
```

### Create database

Create a new redis database on [upstash](https://console.upstash.com/)

## Basic Usage:

```ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})

// string
await redis.set('key', 'value');
let data = await redis.get('key');
console.log(data)

await redis.set('key2', 'value2', {ex: 1});

// sorted set
await redis.zadd('scores', { score: 1, member: 'team1' })
data = await redis.zrange('scores', 0, 100 )
console.log(data)

// list
await redis.lpush('elements', 'magnesium')
data = await redis.lrange('elements', 0, 100 )
console.log(data)

// hash
await redis.hset('people', {name: 'joe'})
data = await redis.hget('people', 'name' )
console.log(data)

// sets
await redis.sadd('animals', 'cat')
data  = await redis.spop('animals', 1)
console.log(data)
```

## Troubleshooting

We have a
[dedicated page](https://docs.upstash.com/redis/sdks/javascriptsdk/troubleshooting)
for common problems. If you can't find a solution, please
[open an issue](https://github.com/upstash/upstash-redis/issues/new).

## Docs

See [the documentation](https://docs.upstash.com/features/javascriptsdk) for
details.

## Contributing

### [Install Deno](https://deno.land/#installation)

### Database

Create a new redis database on [upstash](https://console.upstash.com/) and copy
the url and token

### Running tests

```sh
UPSTASH_REDIS_REST_URL=".." UPSTASH_REDIS_REST_TOKEN=".." deno test -A
```

### Telemetry

This library sends anonymous telemetry data to help us improve your experience.
We collect the following:

- SDK version
- Platform (Deno, Cloudflare, Vercel)
- Runtime version (node@18.x)

You can opt out by setting the `UPSTASH_DISABLE_TELEMETRY` environment variable
to any truthy value.

```sh
UPSTASH_DISABLE_TELEMETRY=1
```
