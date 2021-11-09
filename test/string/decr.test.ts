import { set, decr, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('decr command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, '100');

    const { data } = await decr(key);
    expect(data).toBe(99);
  });
});
