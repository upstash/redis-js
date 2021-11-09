import { sadd, smembers, srem, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('srem command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'a', 'b', 'c');
    expect(sadd1).toBe(3);

    const { data: move } = await srem(key, 'a');
    expect(move).toBe(1);

    const { data: members } = await smembers(key);
    expect(members).toHaveLength(2);
  });
});
