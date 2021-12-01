import { Router } from 'flight-path';
import { auth, incr } from '@upstash/redis';

const router = new Router();

auth({
  url: 'UPSTASH_REDIS_REST_URL',
  token: 'UPSTASH_REDIS_REST_TOKEN',
  requestOptions: { backend: 'upstash-db' },
});

router.get('/', async (req, res) => {
  const { data: count } = await incr('count');
  res.send(`Fastly with Upstash! Count: ${count}`);
});

router.listen();
