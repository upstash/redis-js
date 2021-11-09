import { set, expire, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('expire command', () => {
  it('single key', async () => {
    const key = nanoid();
    const value = nanoid();

    await set(key, value);

    const { data: expireData } = await expire(key, 10);
    expect(expireData).toBe(1);
  });
});
