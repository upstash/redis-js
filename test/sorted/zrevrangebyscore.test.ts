import { zadd, zrevrangebyscore, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zrevrangebyscore command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(
      key,
      1,
      'a',
      2,
      'b',
      3,
      'c',
      4,
      'd',
      5,
      'e'
    );
    expect(addData).toBe(5);

    const { data: range1 } = await zrevrangebyscore(key, '-inf', '(3');
    expect(range1).toMatchObject(['a', 'b']);
  });
});
