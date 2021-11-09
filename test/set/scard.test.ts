import { sadd, scard, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('scard command', () => {
  it('save data', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'Hello');
    expect(sadd1).toBe(1);

    const { data: sadd2 } = await sadd(key, 'World');
    expect(sadd2).toBe(1);

    const { data } = await scard(key);
    expect(data).toBe(2);
  });
});
