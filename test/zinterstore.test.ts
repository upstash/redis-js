import { zadd, zrange, zinterstore } from '../dist/main';
import { nanoid } from 'nanoid';

describe('zinterstore command', () => {
  it('basic', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key = nanoid();

    const { data: add1 } = await zadd(key1, [1, 'a', 2, 'b']);
    expect(add1).toBe(2);

    const { data: add2 } = await zadd(key2, [1, 'a', 2, 'd', 3, 'c']);
    expect(add2).toBe(3);

    const { data: store } = await zinterstore(key, [key1, key2]);
    expect(store).toBe(1);

    const { data } = await zrange(key, 0, -1, { withScores: true });
    expect(data).toMatchObject(['a', '2']);
  });

  it('with weights', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key = nanoid();

    const { data: add1 } = await zadd(key1, [1, 'a', 2, 'b']);
    expect(add1).toBe(2);

    const { data: add2 } = await zadd(key2, [1, 'a', 2, 'd', 3, 'c']);
    expect(add2).toBe(3);

    const { data: store } = await zinterstore(key, [key1, key2], {
      weights: [2, 4],
    });
    expect(store).toBe(1);

    const { data } = await zrange(key, 0, -1, { withScores: true });
    expect(data).toMatchObject(['a', '6']);
  });

  it('with aggregate', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key = nanoid();

    const { data: add1 } = await zadd(key1, [1, 'a', 2, 'b']);
    expect(add1).toBe(2);

    const { data: add2 } = await zadd(key2, [5, 'a', 2, 'd', 3, 'c']);
    expect(add2).toBe(3);

    const { data: store } = await zinterstore(key, [key1, key2], {
      aggregate: 'MIN',
    });
    expect(store).toBe(1);

    const { data } = await zrange(key, 0, -1, { withScores: true });
    expect(data).toMatchObject(['a', '1']);
  });
});
