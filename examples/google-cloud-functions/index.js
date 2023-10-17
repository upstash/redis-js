const functions = require("@google-cloud/functions-framework");
const { Redis } = require("@upstash/redis/with-fetch");

functions.http("helloWorld", async (_req, res) => {
  const redis = Redis.fromEnv();

  const set = await redis.set("rng", Math.random());
  const get = await redis.get("rng");

  res.send({
    statusCode: 200,
    body: JSON.stringify({
      set,
      get,
    }),
  });
});
