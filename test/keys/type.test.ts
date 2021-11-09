import { auth, set, type } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('type command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 'Upstash');

    const { data } = await type(key);
    expect(data).toBe('string');
  });
});
