import dotenv from 'dotenv';
import upstash, { auth, get } from '@upstash/redis';

dotenv.config();

const redis = upstash({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

(async function run() {
  const res1 = await redis.set('node', '23');
  console.log(res1);

  auth({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const res2 = await get('node');
  console.log(res2);
})();
