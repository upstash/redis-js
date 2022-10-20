const { Redis } = require("@upstash/redis/with-fetch");
import type {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export const handler = async (
  _event: APIGatewayEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
  try {
    const redis = Redis.fromEnv();

    const set = await redis.set("rng", Math.random());
    const get = await redis.get("rng");

    return {
      statusCode: 200,
      body: JSON.stringify({
        set,
        get,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 200,
      body: err.message,
    };
  }
};
