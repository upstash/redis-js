# Deploying to Cloudflare Workers

You can use @upstash/redis in Cloudflare Workers as it accesses the Redis using
REST calls.

## 1. Installing wrangler CLI

Workers requires wrangler, a tool to deploy your function. Run the following
command:

```bash
npm install -g @cloudflare/wrangler
```

## 2. Initialize the Project

Create your wrangler project:

```bash
wrangler generate workers-with-redis
```

You’ll notice your project structure should now look something like:

```
├── wrangler.toml
├── index.js
├── package.json
```

## 3. Add Upstash Redis to project

Install the @upstash/redis

```bash
cd workers-with-redis
npm install @upstash/redis
```

Create a database in [Upstash Console](https://console.upstash.com/). Global
database is recommended for Cloudflare Workers as it provides better global
latency.

Copy following variable from Upstash console and paste them to `wrangler.toml`

```toml
# wrangler.toml
[vars]
UPSTASH_REDIS_REST_URL = ""
UPSTASH_REDIS_REST_TOKEN = ""
```

Update type to `webpack`

```toml
type = "webpack"
```

Edit `index.js`

```js
// index.js
import { auth, incr } from "@upstash/redis";

auth(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN);

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname !== "/") {
    return new Response();
  }

  const { data: count } = await incr("workers-count");

  return new Response(html(count), {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}

const html = (count) => `
  <h1>Cloudflare Workers with Upstash Redis</h1>
  <h2>Count: ${count}</h2>
`;
```

## 4. Configure

To authenticate into your Cloudflare account and copy `account_id`

> Follow the
> [Quick Start](https://developers.cloudflare.com/workers/get-started/guide#configure)
> for steps on gathering the correct account ID and API token to link wrangler
> to your Cloudflare account.

```toml
# wrangler.toml
account_id = "a123..."
```

## 5. Build and Publish the project

Test your worker locally

```bash
wrangler dev
```

Build your worker

```bash
wrangler build
```

Deploy your worker

```bash
wrangler publish
```
