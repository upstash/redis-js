import dotenv from 'dotenv';
import upstash from '@upstash/redis';

dotenv.config();

const { echo } = upstash.default(
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.UPSTASH_REDIS_REST_TOKEN
);

(async function run() {
  const res = await echo('hi');
  console.log(res);
})();
