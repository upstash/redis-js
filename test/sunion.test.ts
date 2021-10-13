import { sadd, sunion } from '../src';
import { nanoid } from 'nanoid';

describe('sunion command', () => {
  it('basic', async () => {
    const key1 = nanoid();
    const key2 = nanoid();

    const { data: sadd1 } = await sadd(key1, ['a', 'b', 'c']);
    expect(sadd1).toBe(3);

    const { data: sadd2 } = await sadd(key2, ['c', 'd', 'e']);
    expect(sadd2).toBe(3);

    const { data } = await sunion([key1, key2]);
    expect(data).toHaveLength(5);
  });
});
