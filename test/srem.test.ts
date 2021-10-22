import { sadd, smembers, srem } from '../src';
import { nanoid } from 'nanoid';

describe('srem command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, ['a', 'b', 'c']);
    expect(sadd1).toBe(3);

    const { data: move } = await srem(key, ['a']);
    expect(move).toBe(1);

    const { data: members } = await smembers(key);
    expect(members).toHaveLength(2);
  });
});
