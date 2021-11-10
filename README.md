# Upstash Redis

An HTTP/REST based Redis client built on top of [Upstash REST API](https://docs.upstash.com/features/restapi).

[![Tests](https://github.com/upstash/upstash-redis/actions/workflows/test.yml/badge.svg)](https://github.com/upstash/upstash-redis/actions/workflows/test.yml)
![npm (scoped)](https://img.shields.io/npm/v/@upstash/redis)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@upstash/redis)

It is the only connectionless (HTTP based) Redis client and designed for:

- Serverless functions (AWS Lambda ...)
- Cloudflare Workers (see [the example](https://github.com/upstash/upstash-redis/tree/master/examples/workers-with-upstash))
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

> If you define `UPSTASH_REDIS_REST_URL` and` UPSTASH_REDIS_REST_TOKEN` environment variables, you can run the Redis commands directly.

### Edge Support

Once you set `edgeUrl`, all read commands are fetched using edge url. The REST URL is used for write/update commands.

```typescript
import upstash from '@upstash/redis';

const redis = upstash({
  url: 'UPSTASH_REDIS_REST_URL',
  token: 'UPSTASH_REDIS_REST_TOKEN',
  edgeUrl: 'UPSTASH_REDIS_EDGE_URL',
});

(async () => {
  try {
    // the below reads using edge url
    const { data, error, metadata } = await redis.get('key');
    if (error) throw error;
    console.log(data);
    // -> null | string
    console.log(metadata);
    // -> { edge: boolean, cache: null | 'miss' | 'hit' }

    // the below reads using REST url (non-edge)
    const get1 = await redis.get('key', { edge: false });
    if (get1.error) throw get1.error;
  } catch (error) {
    console.error(error);
  }
})();
```
