import { zadd, zrange, zunionstore } from '../src';
import { nanoid } from 'nanoid';

describe('zunionstore command', () => {
  it('basic', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key = nanoid();

    const { data: add1 } = await zadd(key1, [1, 'a', 2, 'b']);
    expect(add1).toBe(2);

    const { data: add2 } = await zadd(key2, [1, 'a', 3, 'd']);
    expect(add2).toBe(2);

    const { data: store } = await zunionstore(key, [key1, key2]);
    expect(store).toBe(3);

    const { data } = await zrange(key, 0, -1, { withScores: true });
    expect(data).toMatchObject(['a', '2', 'b', '2', 'd', '3']);
  });
});
