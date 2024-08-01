import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const handler = async function() {
    const count = await redis.incr("counter");
    return {
        statusCode: 200,
        body: JSON.stringify('Counter: ' + count),
    };
};
