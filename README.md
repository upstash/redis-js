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

## Upgrading to v1.4.0 **(ReferenceError: fetch is not defined)**

If you are running on nodejs v17 and earlier, `fetch` will not be natively
supported. Platforms like Vercel, Netlify, Deno, Fastly etc. provide a polyfill
for you. But if you are running on bare node, you need to either specify a
polyfill yourself or change the import path to:

```typescript
import { Redis } from "@upstash/redis/with-fetch";
```

## Upgrading from v0.2.0?

Please read the
[migration guide](https://github.com/upstash/upstash-redis#migrating-to-v1). For
further explanation we wrote a
[blog post](https://blog.upstash.com/upstash-redis-sdk-v1).

## Quick Start

### Install

#### npm

```bash
npm install @upstash/redis
```

#### Deno

```ts
import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";
```

### Create database

Create a new redis database on [upstash](https://console.upstash.com/)


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

```
```
