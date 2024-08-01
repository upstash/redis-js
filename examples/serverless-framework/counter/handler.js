const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

exports.counter = async (event) => {
    const count = await redis.incr("counter");
    return {
        statusCode: 200,
        body: JSON.stringify('Counter: ' + count),
    };
};

