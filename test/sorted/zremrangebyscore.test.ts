import { zadd, zremrangebyscore, zrange, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zremrangebyscore command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(
      key,
      1,
      'donatello',
      2,
      'leonardo',
      3,
      'michelangelo',
      4,
      'rafael'
    );
    expect(addData).toBe(4);

    const { data } = await zremrangebyscore(key, '-inf', 2);
    expect(data).toBe(2);

    const { data: rangeData } = await zrange(key, 0, -1);
    expect(rangeData).toMatchObject(['michelangelo', 'rafael']);
  });
});
