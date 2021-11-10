import { zadd, zpopmin } from '../../src';
import { nanoid } from 'nanoid';

describe('zpopmin command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b');
    expect(addData).toBe(2);

    const { data: rangeData } = await zpopmin(key);
    expect(rangeData).toMatchObject(['b', '5']);
  });

  it('with count', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b', 15, 'c');
    expect(addData).toBe(3);

    const { data: rangeData } = await zpopmin(key, 2);
    expect(rangeData).toMatchObject(['b', '5', 'a', '10']);
  });
});
