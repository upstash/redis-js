import dotenv from 'dotenv';
import upstash from '@upstash/redis';

console.log(upstash);

dotenv.config();

const { echo } = upstash(
  process.env.UPSTASH_REDIS_REST_URL,
  process.env.UPSTASH_REDIS_REST_TOKEN
);

(async function run() {
  const res = await echo();
  console.log(res);
})();
