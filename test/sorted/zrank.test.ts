import { zadd, zrank, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zrank command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 1, 'a', 2, 'b');
    expect(addData).toBe(2);

    const { data } = await zrank(key, 'b');
    expect(data).toBe(1);
  });

  it('should be null', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 1, 'a', 2, 'b');
    expect(addData).toBe(2);

    const { data } = await zrank(key, 'z');
    expect(data).toBeNull();
  });
});
