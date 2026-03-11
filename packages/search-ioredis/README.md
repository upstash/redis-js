# @upstash/search-ioredis

Use ioredis with @upstash/redis for Redis Search operations.

## Installation

```bash
npm install @upstash/search-ioredis ioredis
```

## Usage

```typescript
import IORedis from "ioredis";
import { createSearch, s } from "@upstash/search-ioredis";

// Create ioredis client (supports redis:// and rediss:// URLs)
const ioredis = new IORedis(process.env.REDIS_URL);

// Create search client
const search = createSearch(ioredis);

const schema = s.object({
  title: s.string(),
  price: s.number(),
});

// Use Redis Search commands
await search.createIndex({
  name: "products",
  prefix: "product:",
  dataType: "string",
  schema,
});

const index = search.index({ name: "products", schema });
await index.query();
```

## Testing

To run the tests, you need an Upstash Redis server. Set the `REDIS_URL` environment variable:

```bash
export REDIS_URL=rediss://default:<PASSWORD>@<YOUR-DATABASE>.upstash.io:6379

# Run tests
npm test
```

## License

MIT
