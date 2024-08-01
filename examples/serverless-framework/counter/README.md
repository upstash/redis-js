# Serverless Framework Example

### Prerequisites

1. Install the Serverless Framework with `npm i serverless -g`

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/serverless-framework/counter
npm install
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into your `.env` file.

```shell
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

### Developing
Run the following command to start your dev session.
```shell
serverless dev
```

### Deployment
Run the following command to deploy your service.
```shell
serverless deploy
```

Visit the output url.
