# Google Cloud Functions Example

### Prerequisites

1. [Create a Google Cloud Project.](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
2. [Enable billing for your project.](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled#console)
3. Enable Cloud Functions, Cloud Build, Artifact Registry, Cloud Run, Logging, and Pub/Sub APIs.
4. [Install](https://cloud.google.com/sdk/docs/install) and [initialize](https://cloud.google.com/sdk/docs/initializing) the Google Cloud CLI.

### Project Setup

Clone the example

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/google-cloud-functions
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli). Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for the next steps.

### Deploy

```shell
gcloud functions deploy counter-function \
--gen2 \
--runtime=nodejs20 \
--region=<YOUR_REGION> \
--source=. \
--entry-point=counter \
--set-env-vars UPSTASH_REDIS_REST_URL=<YOUR_URL>,UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN> \
--trigger-http \
--allow-unauthenticated
```

Visit the URL provided by the deployment to see the counter in action.