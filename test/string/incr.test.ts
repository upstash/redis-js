import { set, incr, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('incr command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 2);

    const { data } = await incr(key);
    expect(data).toBe(3);
  });
});
