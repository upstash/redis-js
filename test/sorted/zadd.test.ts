import { zadd, zrange } from '../../src';
import { nanoid } from 'nanoid';

describe('zadd command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 0, 'a', 4, 'b');
    expect(addData).toBe(2);

    const { data: rangeData } = await zrange(key, 0, -1, 'WITHSCORES');
    expect(rangeData).toMatchObject(['a', '0', 'b', '4']);
  });
});
