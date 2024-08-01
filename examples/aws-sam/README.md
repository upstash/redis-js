# AWS SAM Example

### Prerequisites

1. [Complete AWS SAM Prerequisites](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/prerequisites.html)
2. [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

### Project Setup

Clone the example

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/aws-sam
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli). Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for the next steps.

### Build
  
```shell
sam build
```

### Deploy

Enter your database related environment variables when prompted.
```shell
sam deploy --guided
```

Visit the HelloWorld API Gateway URL to see the response.