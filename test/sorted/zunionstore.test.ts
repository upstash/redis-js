import { zadd, zrange, zunionstore, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zunionstore command', () => {
  it('basic', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key = nanoid();

    const { data: add1 } = await zadd(key1, 1, 'a', 2, 'b');
    expect(add1).toBe(2);

    const { data: add2 } = await zadd(key2, 1, 'a', 3, 'd');
    expect(add2).toBe(2);

    const { data: store } = await zunionstore(key, 2, key1, key2);
    expect(store).toBe(3);

    const { data } = await zrange(key, 0, -1, 'WITHSCORES');
    expect(data).toMatchObject(['a', '2', 'b', '2', 'd', '3']);
  });
});
