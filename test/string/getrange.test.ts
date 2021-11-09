import { getrange, set, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('getrange command', () => {
  it('basic', async () => {
    const key = nanoid();
    const value = 'This is a string';

    await set(key, value);

    const { data } = await getrange(key, 0, 3);
    expect(data).toBe('This');
  });
});
