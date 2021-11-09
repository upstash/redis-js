import { sadd, smembers, spop, srandmember } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('srandmember command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'a', 'b', 'c');
    expect(sadd1).toBe(3);

    const { data: move } = await srandmember(key);
    expect(['a', 'b', 'c']).toContain(move);
  });

  it('with count', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'a', 'b', 'c', 'd');
    expect(sadd1).toBe(4);

    const { data: move } = await srandmember(key, 2);
    expect(move).toHaveLength(2);
  });

  it('with negative count', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'a', 'b', 'c', 'd');
    expect(sadd1).toBe(4);

    const { data: move } = await srandmember(key, -5);
    expect(move).toHaveLength(5);
  });
});
