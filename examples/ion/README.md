# Ion Example

### Prerequisites

You need to have AWS credentials configured locally and SST CLI installed.

1. [Create an AWS account](https://aws.amazon.com/)
2. [Create an IAM user](https://sst.dev/chapters/create-an-iam-user.html)
3. [Configure the AWS CLI](https://sst.dev/chapters/configure-the-aws-cli.html)
4. [Setup SST CLI](https://ion.sst.dev/docs/reference/cli/)

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/ion
npm install
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into your `.env` file.

```shell .env
UPSTASH_REDIS_REST_URL=<YOUR_URL>
UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

### Run

Run the SST app.

```shell
sst dev next dev
```

Check `http://localhost:3000/`

### Deploy

Deploy with SST.

```shell
sst deploy
```

Check the output URL.