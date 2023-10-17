# Google Cloud Functions Example

## How to use

1. Clone and install the example

```bash
git clone https://github.com/upstash/upstash-redis.git
cd upstash-redis/examples/google-cloud-functions
npm install
```

2. Create a free Database on [upstash.com](https://console.upstash.com/redis)
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to
   `Runtime, build, connections and security settings > Runtime environment variables` in GCP website when creating a new function or pass those keys when you are deploying from the CLI.


## Work locally

Simply run `npm run start`