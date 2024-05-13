## Auto Pipeline Example

This nextjs example showcases how Auto Pipelining works.

In the `app/data/redis.ts` file, we define a redis client with `enableAutoPipelining: true`:

```tsx
import { Redis } from '@upstash/redis'

export const LATENCY_LOGGING = true
export const ENABLE_AUTO_PIPELINING = true

const client = Redis.fromEnv({
  latencyLogging: LATENCY_LOGGING,
  enableAutoPipelining: ENABLE_AUTO_PIPELINING
});

export default client;
```

We utilize this client in the `app/data/getUsers.ts` and `app/data/getEvents.ts` files to fetch data from the redis server (if there is no data, we insert data for the purposes of this example):

```tsx
// app/data/getUsers.ts

import client from "./redis"

export async function getUsers() {
  const keys = await client.scan(0, { match: 'user:*' });

  if (keys[1].length === 0) {
    // If no keys found, insert sample data
    client.hmset('user:1', {'username': 'Adam', 'birthday': '1990-01-01'});
    client.hmset('user:2', {'username': 'Eve', 'birthday': '1980-01-05'});
    // Add more sample users as needed
  }

  const users = await Promise.all(keys[1].map(async key => {
    return client.hgetall(key) ?? {username: "default", birthday: "2000-01-01"};
  }));
  return users as {username: string, birthday: string}[]
}
```

Both `getUsers` and `getEvents` work in a similar way. They first call and await scan to get the keys. Then, they call `HGETALL` with these keys.

We import the `getUsers` and `getEvents` methods in our page `app/components/page.tsx`:

```tsx
"use server"
import client from "../data/redis"
import { getEvents } from "../data/getEvents";
import { getUsers } from "../data/getUsers";

const DataComponent = async () => {


  const [ users, events ] = await Promise.all([
    getUsers(),
    getEvents()
  ])

  // @ts-ignore pipelineCounter is accessible but not available in the type
  const counter = client.pipelineCounter

  return (
    <div>
    ... skipped to keep the README short ...
    </div>
  );
};

export default DataComponent;

```

Thanks to auto pipelining, the scan commands from the two methods are sent in a single pipeline call. Then, the 4 `HGETALL` commands are sent in a second pipeline. In the end, 6 commands are sent with only two pipelines, with minimal overhead for the programmer.
