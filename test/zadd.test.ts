import { zadd, zrange } from '../dist/main';
import { nanoid } from 'nanoid';

describe('zadd command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [0, 'a', 4, 'b']);
    expect(addData).toBe(2);

    const { data: rangeData } = await zrange(key, 0, -1, { withScores: true });
    expect(rangeData).toMatchObject(['a', '0', 'b', '4']);
  });

  it('set incr', async () => {
    const key = nanoid();

    const { data: data1 } = await zadd(key, [5, 'a']);
    expect(data1).toBe(1);

    const { data: data2 } = await zadd(key, [5, 'a'], { incr: true });
    expect(data2).toBe('10');
  });
});
