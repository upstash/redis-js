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
- Fastly Compute@Edge (see
  [the example](https://github.com/upstash/upstash-redis/tree/master/examples/fastly))
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

#### Automatic authentication from environment variables

If you have added `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as environent variables, you can automatically load them:

```ts
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

// or on cloudflare workers
const redis = Redis.onCloudflare()
```

### Working with types

Most commands allow you to provide a type to make working with typescript easier.

```ts
const data = await redis.get<MyCustomType>("key")
// data is typed as `MyCustomType`
```

## Migrating to v1

### API changes

### Explicit authentication

Authentication is no longer automatically trying to load connection secrets from environment variables.
You must either supply them yourself:

```ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
})
```

Or use one of the static constructors to load from environment variables:

```ts
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

// or when deploying to cloudflare workers
const redis = Redis.fromCloudflareEnv()
```

### Error handling

Errors are now thrown automatically instead of being returned to you.

```ts
// old
const { data, error } = await set("key", "value")
if (error) {
  throw new Error(error)
}

// new
const data = await redis.set("key", "value") // error is thrown automatically
```

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

p.set("key", 2)
p.incr("key")

// or inline:
p.hset("key2", "field", { hello: "world" }).hvals("key2")

// Execute the pipeline once you are done building it:
// `exec` returns an array where each element represents the response of a command in the pipeline.
// You can optionally provide a type like this to get a typed response.
const res = await p.exec<[Type1, Type2, Type3]>()

```

For more information about pipelines using REST see [here](https://blog.upstash.com/pipeline).

### Environments

We support various platforms, such as nodejs, cloudflare and fastly.

Regardless of your environment you can always create a redis instance like this:

```ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
  // .. optional config
})
```

However we offer a more convenient way for specific platforms.

#### Node.js

Examples: Vercel, Netlify, AWS Lambda

If you are running on nodejs you can set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as environment variable and create a redis instance like this:

```ts
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()
```

- [Code example](https://github.com/upstash/upstash-redis/tree/main/examples/node)

#### Cloudflare Workers

Cloudflare handles environment variables differently than nodejs.
Please add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` using `wrangler secret put ...` or in the cloudflare dashboard.

Afterwards you can create a redis instance:

```ts
import { Redis } from "@upstash/redis"

const redis = Redis.onCloudflare()
```

- [Code example](https://github.com/upstash/upstash-redis/tree/main/examples/cloudflare-workers)
- [Documentation](https://docs.upstash.com/redis/tutorials/cloudflare_workers_with_redis)

#### Fastly

Fastly introduces a concept called [backend](https://developer.fastly.com/reference/api/services/backend/). You need to configure a backend in your `fastly.toml`. An example can be found [here](https://github.com/upstash/upstash-redis/blob/main/examples/fastly/fastly.toml).

Until the fastly api stabilizes we recommend creating an instance manually:

```ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: <UPSTASH_REDIS_REST_URL>,
  token: <UPSTASH_REDIS_REST_TOKEN>,
  requestOptions: {
    backend: <BACKEND_NAME>,
  },
})
```

- [Code example](https://github.com/upstash/upstash-redis/tree/main/examples/fastly)
- [Documentation](https://blog.upstash.com/fastly-compute-edge-with-redi)

### Advanced

Low level `Command` classes can be imported from `@upstash/redis/commands`.
`Redis` is just a wrapper around these commands for your convenience.
In case you need more control about types and or (de)serialization, please use a `Command`-class directly.

```ts
import { GetCommand, HttpClient} from "@upstash/redis"

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
