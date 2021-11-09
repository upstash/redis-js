import { set, incrby, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('incrby command', () => {
  const key = nanoid();

  it('basic', async () => {
    await set(key, 2);

    const { data } = await incrby(key, 3);
    expect(data).toBe(5);
  });
});
