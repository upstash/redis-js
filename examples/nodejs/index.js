import dotenv from 'dotenv';
import upstash from '@upstash/redis';

dotenv.config();

const redis = upstash.default({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  edgeUrl: process.env.UPSTASH_REDIS_EDGE_URL,
});

(async function run() {
  const res1 = await redis.set('node', '23');
  console.log(res1);

  const res2 = await redis.get('node');
  console.log(res2);
})();
