import { sadd, smembers, spop, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('spop command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'a', 'b', 'c');
    expect(sadd1).toBe(3);

    const { data: move } = await spop(key);
    expect(['a', 'b', 'c']).toEqual(expect.arrayContaining([move]));

    const { data: members } = await smembers(key);
    expect(members).toHaveLength(2);
  });

  it('with count', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'a', 'b', 'c', 'd');
    expect(sadd1).toBe(4);

    const { data: move } = await spop(key, 2);
    expect(['a', 'b', 'c', 'd']).toEqual(expect.arrayContaining(move));

    const { data: members } = await smembers(key);
    expect(members).toHaveLength(2);
  });
});
