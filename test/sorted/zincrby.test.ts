import { zadd, zrange, zincrby } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('zincrby command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 0, 'a', 4, 'b');
    expect(addData).toBe(2);

    const { data: incrData } = await zincrby(key, 10, 'a');
    expect(incrData).toBe('10');

    const { data: rangeData } = await zrange(key, 0, -1, 'WITHSCORES');
    expect(rangeData).toMatchObject(['b', '4', 'a', '10']);
  });
});
