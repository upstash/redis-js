import { set, strlen, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('strlen command', () => {
  it('return value', async () => {
    const key = nanoid();
    const value = nanoid();

    await set(key, value);

    const { data } = await strlen(key);
    expect(data).toBe(value.length);
  });

  it('return no existing', async () => {
    const { data } = await strlen('nonexisting');
    expect(data).toBe(0);
  });
});
