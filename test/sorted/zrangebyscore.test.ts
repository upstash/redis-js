import { zadd, zrangebyscore, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zrangebyscore command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b', 15, 'c', 3, 'd');
    expect(addData).toBe(4);

    const { data: rangeData } = await zrangebyscore(key, '-inf', '+inf');
    expect(rangeData).toMatchObject(['d', 'b', 'a', 'c']);
  });

  it('with score', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b', 15, 'c', 3, 'd');
    expect(addData).toBe(4);

    const { data: rangeData } = await zrangebyscore(
      key,
      '+inf',
      '-inf',
      'WITHSCORES'
    );
    expect(rangeData).toMatchObject(['c', '15', 'a', '10', 'b', '5', 'd', '3']);
  });

  it('with score and limit', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b', 15, 'c', 3, 'd');
    expect(addData).toBe(4);

    const { data: rangeData } = await zrangebyscore(
      key,
      '+inf',
      '-inf',
      'WITHSCORES',
      'LIMIT',
      1,
      2
    );
    expect(rangeData).toMatchObject(['a', '10', 'b', '5']);
  });
});
