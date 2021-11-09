import { set, expire, ttl, persist, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('persist command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 'Hello');

    const { data: data1 } = await expire(key, 10);
    expect(data1).toBe(1);

    const { data: data2 } = await ttl(key);
    expect(data2).toBeGreaterThan(0);

    const { data: data3 } = await persist(key);
    expect(data3).toBe(1);

    const { data: data4 } = await ttl(key);
    expect(data4).toBe(-1);
  });
});
