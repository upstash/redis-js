# Upstash Redis

An HTTP/REST based Redis client built on top of
[Upstash REST API](https://docs.upstash.com/features/restapi).

[![Tests](https://github.com/upstash/upstash-redis/actions/workflows/test.yml/badge.svg)](https://github.com/upstash/upstash-redis/actions/workflows/test.yml)
![npm (scoped)](https://img.shields.io/npm/v/@upstash/redis)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@upstash/redis)

It is the only connectionless (HTTP based) Redis client and designed for:

- Serverless functions (AWS Lambda ...)
- Cloudflare Workers (see
  [the example](https://github.com/upstash/upstash-redis/tree/master/examples/cloudflare-workers))
- Fastly Compute@Edge
- Next.js, Jamstack ...
- Client side web/mobile applications
- WebAssembly
- and other environments where HTTP is preferred over TCP.

See
[the list of APIs](https://docs.upstash.com/features/restapi#rest---redis-api-compatibility)
supported.

## Quick Start

### Install

```bash
npm install @upstash/redis
```

```ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})


const data = await redis.get("key)

```

### Working with types

Most commands allow you to provide a type to make working with typescript easier.

```ts
const data = await redis.get<MyCustomType>("key")
// data is typed as `MyCustomType`
```

## Migrating from v1 to v2

TODO:

- explicit auth.
-

### Pipeline

Pipelining commands allows you to send a single http request with multiple commands.

```ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})

const p = redis.pipeline()

// Now you can chain multiple commands to create your pipeline:

p.set("key",2)
p.incr("key")

// or inline:
p.hset("key2", "field", { hello: "world" }).hvals("key2")

// Execute the pipeline once you are done building it:
// `exec` returns an array where each element represents the response of a command in the pipeline.
// You can optionally provide a type like this to get a typed response.
const res = await p.exec<[Type1, Type2, Type3]>()

```

For more information about pipelines using REST see [here](https://blog.upstash.com/pipeline).

### Advanded

Low level `Command` classes can be imported from `@upstash/redis/commands`.
`Redis` is just a wrapper around these commands for your convenience.
In case you need more control about types and or (de)serialization, please use a `Command`-class directly.

```ts
import { GetCommand } from "@upstash/redis/commands"
import { HttpClient } from "@upstash/redis/http"

const client = new HttpClient({
  baseUrl: <UPSTASH_REDIS_REST_URL>,
  headers: {
    authorization: `Bearer ${<UPSTASH_REDIS_REST_TOKEN>}`,
  },
})

const get = new GetCommand<OptionalCustomType>("key")

const data = await get.exec(client)
```

## Docs

See [the documentation](https://docs.upstash.com/features/javascriptsdk) for
details.

## Contributing

### Installing dependencies

```bash
pnpm install
```

### Database

Create a new redis database on [upstash](https://console.upstash.com/) and copy the url and token to `.env` (See `.env.example` for reference)

### Running tests

```sh
pnpm test
```
