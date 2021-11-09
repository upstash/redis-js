import { zadd, zcard, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zcard command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 1, 'one', 2, 'two');
    expect(addData).toBe(2);

    const { data } = await zcard(key);
    expect(data).toBe(2);
  });
});
