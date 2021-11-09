import { auth, ping } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('ping command', () => {
  it('basic', async () => {
    const { data } = await ping();
    expect(data).toBe('PONG');
  });

  it('return value', async () => {
    const value = nanoid();

    const { data } = await ping(value);
    expect(data).toBe(value);
  });
});
