import { Handler } from "@netlify/functions";
import { Redis } from "@upstash/redis/with-fetch";

const redis = Redis.fromEnv();

const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
      counter: await redis.incr("netlify"),
    }),
  };
};

export { handler };
