import { sadd, smembers, smove } from '../src';
import { nanoid } from 'nanoid';

describe('smove command', () => {
  it('save data', async () => {
    const key1 = nanoid();
    const key2 = nanoid();

    const { data: sadd1 } = await sadd(key1, ['a', 'b']);
    expect(sadd1).toBe(2);

    const { data: sadd2 } = await sadd(key2, ['c']);
    expect(sadd2).toBe(1);

    const { data: move } = await smove(key1, key2, 'b');
    expect(move).toBe(1);

    const { data: members } = await smembers(key2);
    expect(members).toMatchObject(['c', 'b']);
  });
});
