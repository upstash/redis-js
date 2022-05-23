const { Redis } = require("@upstash/redis");

exports.handler = async (_event, _context) => {
  let response;
  try {
    const redis = Redis.fromEnv();

    const set = await redis.set("node", '{"hello":"world"}');

    const get = await redis.get("node");

    response = {
      "statusCode": 200,
      "body": JSON.stringify({
        set,
        get,
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
