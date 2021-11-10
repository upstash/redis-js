import { get, set, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('get command', () => {
  it('return null', async () => {
    const { data } = await get('keynull');
    expect(data).toBe(null);
  });

  it('return a value without edge', async () => {
    const key = nanoid();
    await set(key, 'hello');

    const { data } = await get(key);
    expect(data).toBe('hello');
  });

  it('return a value with edge', async () => {
    const key = nanoid();

    await set(key, 'hello');

    const { data } = await get(key);
    expect(data).toBe('hello');
  });
});
