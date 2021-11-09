import { set, append, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('append command', () => {
  it('success', async () => {
    const key = nanoid();
    const value = nanoid();

    await set(key, value);

    const { data } = await append(key, value);
    expect(data).toBe(value.length * 2);
  });
});
