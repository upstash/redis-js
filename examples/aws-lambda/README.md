# AWS Lambda Example

### Prerequisites

1. [Create an AWS account](https://aws.amazon.com/)
2. [Set up and configure AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/aws-lambda
npm install
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli). Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for the next steps.

### Create a Deployment Package

```shell
zip -r my_deployment_package.zip .
```

### Deploy

```shell
aws lambda create-function --function-name counterFunction \
--runtime nodejs20.x --handler index.handler \
--role <YOUR_ROLE> \
--zip-file fileb://my_deployment_package.zip \
--region <YOUR_REGION> \
--environment "Variables={UPSTASH_REDIS_REST_URL=<YOUR_URL>,UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>}"
```

Visit the output url.