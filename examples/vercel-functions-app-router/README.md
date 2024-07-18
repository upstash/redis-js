# Vercel Functions - App Router Example

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/vercel-functions-app-router
npm install
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into your `.env` file.

```shell
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```


### Run & Deploy
Run the app locally with `npm run dev`, check `http://localhost:3000/api/hello`

Deploy your app with `vercel`
