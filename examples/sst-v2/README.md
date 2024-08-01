# SST v2 Example

### Prerequisites

You need to have AWS credentials configured locally.

1. [Create an AWS account](https://aws.amazon.com/)
2. [Create an IAM user](https://sst.dev/chapters/create-an-iam-user.html)
3. [Configure the AWS CLI](https://sst.dev/chapters/configure-the-aws-cli.html)

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/sst-v2
npm install
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into your `.env` file.

```shell
npx sst secrets set UPSTASH_REDIS_REST_URL <YOUR_URL>
npx sst secrets set UPSTASH_REDIS_REST_TOKEN <YOUR_TOKEN>
```

### Run

Run the SST app.

```shell
npm run dev
```

After prompted, run the Next.js app.

```shell
cd packages/web
npm run dev
```

Check `http://localhost:3000/api/hello`

### Deploy

Set the secrets for the prod stage.

```shell
npx sst secrets set --stage prod UPSTASH_REDIS_REST_URL <YOUR_URL>
npx sst secrets set --stage prod UPSTASH_REDIS_REST_TOKEN <YOUR_TOKEN>
```

Deploy with SST.

```shell
npx sst deploy --stage prod
```

Check `<SiteUrl>/api/hello` with the given SiteUrl.