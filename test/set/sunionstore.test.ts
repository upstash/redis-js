import { sadd, sunionstore, smembers } from '../../src';
import { nanoid } from 'nanoid';

describe('sunionstore command', () => {
  it('basic', async () => {
    const key = nanoid();
    const key1 = nanoid();
    const key2 = nanoid();

    const { data: sadd1 } = await sadd(key1, 'a', 'b', 'c');
    expect(sadd1).toBe(3);

    const { data: sadd2 } = await sadd(key2, 'c', 'd', 'e');
    expect(sadd2).toBe(3);

    const { data: store } = await sunionstore(key, key1, key2);
    expect(store).toBe(5);

    const { data } = await smembers(key);
    expect(['a', 'b', 'c', 'd', 'e']).toEqual(expect.arrayContaining(data));
  });
});
