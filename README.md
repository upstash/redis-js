# Upstash Redis

`@upstash/redis` is an HTTP/REST based Redis client for typescript, built on top
of [Upstash REST API](https://docs.upstash.com/features/restapi).

[![Tests](https://github.com/upstash/upstash-redis/actions/workflows/tests.yaml/badge.svg)](https://github.com/upstash/upstash-redis/actions/workflows/tests.yaml)
![npm (scoped)](https://img.shields.io/npm/v/@upstash/redis)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@upstash/redis)

> [!NOTE]  
> **This project is in GA Stage.**
>
> The Upstash Professional Support fully covers this project. It receives regular updates, and bug fixes. The Upstash team is committed to maintaining and improving its functionality.

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
[the list of APIs](https://upstash.com/docs/redis/overall/rediscompatibility)
supported.

## Quick Start

### Install

#### Node.js

```bash
npm install @upstash/redis
```

#### Deno

```ts
import { Redis } from "https://esm.sh/@upstash/redis";
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

await redis.set('key3', 'value3', {ex: 1});

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

See [the documentation](https://upstash.com/docs/redis/sdks/ts/overview) for
details.

## Release Workflow

### Stable Release

1. Create a changeset (`pnpm changeset`) describing your changes and merge it to `main`
2. **Changeset** workflow runs on push to `main`. If changesets are pending, it opens a "Version Packages" PR. When that PR is merged, the workflow runs again, publishes git tags, creates GitHub releases, and uploads a `release-meta` artifact
3. **Router** workflow detects the Changeset completion via `workflow_run`, downloads the `release-meta` artifact, and calls the **npm Publish** workflow with `prerelease: false` and the resolved version
4. **npm Publish** checks out the released commit, builds, and publishes to npm under the `latest` tag

### Canary Release

1. Trigger the **Canary Release** workflow manually from the Actions tab, selecting the package
2. It creates a snapshot version (`x.y.z-canary.{timestamp}`), creates a GitHub prerelease, and uploads a `release-meta` artifact
3. **Router** picks it up the same way, calling **npm Publish** with `prerelease: true`
4. **npm Publish** publishes to npm under the `canary` tag

### CI Tests

On every pull request, push to `main`, and daily schedule, the **Router** workflow runs the **Tests** workflow (unit tests, lint, build, and example integration tests).

## Contributing

### [Install Bun](https://bun.sh/docs/installation)

### Database

Create a new redis database on [upstash](https://console.upstash.com/) and copy
the url and token

### Running tests

```sh
bun run test
```

### Building

```sh
bun run build
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

Alternatively, you can pass `enableTelemetry: false` when initializing the Redis client:

```ts
const redis = new Redis({
  // ...,
  enableTelemetry: false,
});
```
