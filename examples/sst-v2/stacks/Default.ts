import { Config, StackContext, NextjsSite } from "sst/constructs";

export function Default({ stack }: StackContext) {
  const UPSTASH_REDIS_REST_URL = new Config.Secret(stack, "UPSTASH_REDIS_REST_URL");
  const UPSTASH_REDIS_REST_TOKEN = new Config.Secret(stack, "UPSTASH_REDIS_REST_TOKEN");
  const site = new NextjsSite(stack, "site", {
    bind: [UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN],
    path: "packages/web",
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
}