# Error Handling

## Overview

Handle Redis errors gracefully with try-catch, implement retry logic for transient failures, and provide fallbacks for degraded operation.

## Good For

- Network failure recovery
- Timeout handling
- Graceful degradation
- Debugging and monitoring
- Production reliability

## Limitations

- Some errors are not recoverable
- Retries can increase latency
- Too many retries may cause cascading failures

## Examples

### Built-in Retry Configuration

```typescript
import { Redis } from "@upstash/redis";

// Default: 5 retries with exponential backoff
const redis = Redis.fromEnv();

// Customize retry behavior
const redisWithRetry = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.exp(retryCount) * 50, // Exponential backoff
  },
});

// Disable retries
const redisNoRetry = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: false, // No retries
});

// Custom backoff strategy
const redisCustomBackoff = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: {
    retries: 10,
    backoff: (retryCount) => {
      // Linear backoff: 100ms, 200ms, 300ms...
      return retryCount * 100;
    },
  },
});
```

### Request Cancellation with AbortSignal

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const redisWithTimeout = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  signal: () => AbortSignal.timeout(5000), // 5 second timeout per request
});

try {
  await redisWithTimeout.get("key");
} catch (error) {
  if (error.name === "TimeoutError") {
    console.error("Request timed out");
  }
}
```
