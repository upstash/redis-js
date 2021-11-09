import { set, exists, expireat, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('expireat command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 'Hello');

    const { data: data1 } = await exists(key);
    expect(data1).toBe(1);

    const { data: data2 } = await expireat(key, 1293840000);
    expect(data2).toBe(1);

    const { data: data3 } = await exists(key);
    expect(data3).toBe(0);
  });
});
