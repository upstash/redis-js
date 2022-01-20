# Upstash Redis

An HTTP/REST based Redis client built on top of [Upstash REST API](https://docs.upstash.com/features/restapi).

[![Tests](https://github.com/upstash/upstash-redis/actions/workflows/test.yml/badge.svg)](https://github.com/upstash/upstash-redis/actions/workflows/test.yml)
![npm (scoped)](https://img.shields.io/npm/v/@upstash/redis)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@upstash/redis)

It is the only connectionless (HTTP based) Redis client and designed for:

- Serverless functions (AWS Lambda ...)
- Cloudflare Workers (see [the example](https://github.com/upstash/upstash-redis/tree/master/examples/cloudflare-workers))
- Fastly Compute@Edge
- Next.js, Jamstack ...
- Client side web/mobile applications
- WebAssembly
- and other environments where HTTP is preferred over TCP.

See [the list of APIs](https://docs.upstash.com/features/restapi#rest---redis-api-compatibility) supported.

## Quick Start

### Install

```bash
npm install @upstash/redis
```

### Usage with Promise

```typescript
import { auth, set } from '@upstash/redis';

auth('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN');

set('key', 'value').then(({ data }) => {
  console.log(data);
  // -> "OK"
});
```

### Usage with async/await

```typescript
import { set } from '@upstash/redis';

(async () => {
  try {
    const { data, error } = await set('key', 'value');
    if (error) throw error;
    console.log(data);
    // -> "OK"
  } catch (error) {
    console.error(error);
  }
})();
```

> If you define `UPSTASH_REDIS_REST_URL` and` UPSTASH_REDIS_REST_TOKEN` environment variables, you can skip the auth().

### Instantiate New Clients

This is useful, if you need separate clients in the same context.

```typescript
import upstash from '@upstash/redis';

const redis = upstash('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN');

(async () => {
  try {
    const { data, error } = await redis.get('key');
    if (error) throw error;
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```

## Docs

See [the documentation](https://docs.upstash.com/features/javascriptsdk) for details.
