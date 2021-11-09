import { set, decrby, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('decrby command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, '100');

    const { data } = await decrby(key, 99);
    expect(data).toBe(1);
  });
});
