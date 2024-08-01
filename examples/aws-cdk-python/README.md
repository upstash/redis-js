# AWS CDK TypeScript Example

### Prerequisites

- Complete all steps in [Getting started with the AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/aws-cdk-python
npm install
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and export `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your environment.

```shell
export UPSTASH_REDIS_REST_URL=<YOUR_URL>
export UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

### Deploy

Run in the top folder:

```shell
cdk synth
cdk bootstrap
cdk deploy
```

Visit the output url.