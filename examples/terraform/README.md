# Terraform Example

### Prerequisites

1. [Create an AWS account](https://aws.amazon.com/)
2. [Set up and configure AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
3. [Install Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/terraform/counter
npm install
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli). Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for the next steps.

### Deploy

Return to terraform directory.

```shell
cd ..
```

Deploy the infrastructure, enter database related environment variables when prompted.

```shell
terraform init
terraform apply
```

Visit `<base_url>/counter` with the output URL.