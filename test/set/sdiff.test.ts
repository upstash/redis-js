import { sadd, sdiff } from '../../src';
import { nanoid } from 'nanoid';

describe('sdiff command', () => {
  it('save data', async () => {
    const key1 = nanoid();
    const key2 = nanoid();

    const { data: sadd1 } = await sadd(key1, 'a', 'b', 'c', 'd');
    expect(sadd1).toBe(4);

    const { data: sadd2 } = await sadd(key2, 'b', 'c');
    expect(sadd2).toBe(2);

    const { data } = await sdiff(key1, key2);
    expect(data).toContain('a');
    expect(data).toContain('d');
  });
});
