# Deploying to Cloudflare Workers

Cloudflare Workers is a serverless platform for creating entirely new
applications or augmenting existing ones without configuring or maintaining
infrastructure. With Workers Sites you can build any static site locally (e.g.
your Upstash project), and deploy to a workers.dev subdomain or custom domain.

## 1. Installing wrangler CLI

Workers Sites requires wrangler, a tool to upload your static files. Run the
following command:

```bash
npm install -g @cloudflare/wrangler
```

## 2. Initialize the Project

Run wrangler in an empty folder directory

```bash
mkdir project-name
cd project-name

wrangler init --site
```

You’ll notice your project structure should now look something like:

```
  ├── wrangler.toml
  ├── workers-site
  │   ├── index.js
  │   └── package.json
```

## 3. Add Upstash Redis to project

```bash
cd workers-site
yarn add upstash-redis
```

Add env variable to `wrangler.toml`

```toml
# wrangler.toml
[vars]
UPSTASH_REDIS_REST_URL = ""
UPSTASH_REDIS_REST_TOKEN = ""
```

> You can access this information from the database page you created via [Upstash Console](https://console.upstash.com/).

> Don't forget to write `"./dist"` in the `bucket` field in the `wrangler.toml` file

Edit `workers-site/index.js`

```js
// index.js
import { auth, incr } from 'upstash-redis';

auth(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN);

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname !== '/') {
    return new Response();
  }

  const { data: count } = await incr('workers-count');

  return new Response(html(count), {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
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

> Follow the [Quick Start](https://developers.cloudflare.com/workers/get-started/guide#configure) for steps on gathering the correct account ID and API token to link wrangler to your Cloudflare account.

```toml
# wrangler.toml
account_id = "a123..."
```

## 5. Build and Publish the project

Build your worker

```bash
wrangler build
```

> If you want to run it in your local server run the command `wrangler dev`

You can deploy your application by running the following command in the root of the project directory:

```bash
wrangler publish
```
