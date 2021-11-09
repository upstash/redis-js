import { zadd, zrevrank, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zrevrank command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 1, 'a', 2, 'b', 3, 'c');
    expect(addData).toBe(3);

    const { data } = await zrevrank(key, 'b');
    expect(data).toBe(1);
  });
});
