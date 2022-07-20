import * as Sentry from "@sentry/node";
import { Redis } from "@upstash/redis";
import "isomorphic-fetch";

const redis = Redis.fromEnv();

redis.use(async (req, next) => {
  console.log("req", JSON.stringify(req, null, 2));

  const scope = Sentry.getCurrentHub().getScope();
  const parentSpan = scope?.getSpan();

  const span = parentSpan?.startChild({
    op: "redis.upstash",
    data: req,
  });

  scope?.addBreadcrumb({
    type: "query",
    category: "upstash.started",
    level: "info",
    data: req,
  });

  const res = await next(req);
  span?.finish();
  console.log("res", JSON.stringify(res, null, 2));
  return res;
});

async function main() {
  await redis.set("foo", Math.random());
  const res = await redis.get("foo");
  console.log(res);
}
main();
