import { sadd, smembers, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('sadd command', () => {
  it('save data', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'Hello');
    expect(sadd1).toBe(1);

    const { data: sadd2 } = await sadd(key, 'World');
    expect(sadd2).toBe(1);

    const { data: sadd3 } = await sadd(key, 'World');
    expect(sadd3).toBe(0);

    const { data } = await smembers(key);
    expect(data).toContain('World');
    expect(data).toContain('Hello');
  });
});
