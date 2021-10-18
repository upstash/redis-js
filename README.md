# Upstash Redis

![npm](https://img.shields.io/npm/dm/upstash-redis)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/upstash-redis)

> Supports Redis 5.0.8

## Quick Start

### Install

```bash
npm install upstash-redis
```

### Usage with Callback Style

```typescript
import upstash from 'upstash-redis';

const redis = upstash('UPSTASH_REDIS_URL', 'UPSTASH_REDIS_TOKEN');

redis.get('key', function ({ data, error }) {
  if (error) {
    return console.error(error);
  }
  console.log(data);
});
```

### Usage with async/await (Promise)

```typescript
import upstash from 'upstash-redis';

const redis = upstash('UPSTASH_REDIS_URL', 'UPSTASH_REDIS_TOKEN');

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

If you define `UPSTASH_REDIS_URL` and` UPSTASH_REDIS_TOKEN` environment variables, you can run the Redis commands directly.

```typescript
import { get } from 'upstash-redis';

(async () => {
  try {
    const { data, error } = await get('key');
    if (error) throw error;
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```
