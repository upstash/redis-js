import { setex, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('setex command', () => {
  it('remaining time', async () => {
    const key = nanoid();
    const value = nanoid();

    const { data } = await setex(key, 10, value);
    expect(data).toBe('OK');
  });
});
