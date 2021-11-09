import { set, expire, pttl, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('ttl command', () => {
  it('remaining time', async () => {
    const key = nanoid();

    await set(key, 'a');

    const { data: expireData } = await expire(key, 10);
    expect(expireData).toBe(1);

    const { data: ttlData } = await pttl(key);
    expect(ttlData).toBeGreaterThanOrEqual(-2);
  });

  it('key does not exist', async () => {
    const key = nanoid();

    await set(key, 'a');

    const { data: expireData } = await expire(key, 1);
    expect(expireData).toBe(1);

    const { data: ttlData } = await pttl(key);
    expect(ttlData).toBeGreaterThanOrEqual(-2);
  });

  it('key exists but has no associated expire', async () => {
    const key = nanoid();

    await set(key, 'a');

    const { data: ttlData } = await pttl(key);
    expect(ttlData).toBeGreaterThanOrEqual(-1);
  });
});
