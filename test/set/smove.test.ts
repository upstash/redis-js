import { sadd, smembers, smove, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('smove command', () => {
  it('save data', async () => {
    const key1 = nanoid();
    const key2 = nanoid();

    const { data: sadd1 } = await sadd(key1, 'a', 'b');
    expect(sadd1).toBe(2);

    const { data: sadd2 } = await sadd(key2, 'c');
    expect(sadd2).toBe(1);

    const { data: move, error } = await smove(key1, key2, 'b');
    expect(move).toBe(1);
    expect(error).toBeNull();

    const { data: members } = await smembers(key2);
    expect(members).toHaveLength(2);
  });
});
