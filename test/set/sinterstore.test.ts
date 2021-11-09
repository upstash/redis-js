import { sadd, sinterstore, smembers, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('sinterstore command', () => {
  it('save data', async () => {
    const key = nanoid();
    const key1 = nanoid();
    const key2 = nanoid();

    const { data: sadd1 } = await sadd(key1, 'a', 'b', 'c', 'd');
    expect(sadd1).toBe(4);

    const { data: sadd2 } = await sadd(key2, 'b', 'c');
    expect(sadd2).toBe(2);

    const { data: storeData } = await sinterstore(key, key1, key2);
    expect(storeData).toBe(2);

    const { data } = await smembers(key);
    expect(data).toContain('b');
    expect(data).toContain('c');
  });
});
