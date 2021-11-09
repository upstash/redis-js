import { zadd, zrangebylex, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zrangebylex command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b', 15, 'c', 3, 'd');
    expect(addData).toBe(4);

    const { data: rangeData } = await zrangebylex(key, '-', '(c');
    expect(rangeData).toMatchObject(['a', 'b']);
  });
});
