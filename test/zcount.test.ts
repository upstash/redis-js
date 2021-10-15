import { zadd, zincrby, zrange } from '../src';
import { nanoid } from 'nanoid';

describe('zcount command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [1, 'one', 2, 'two']);
    expect(addData).toBe(2);

    const { data } = await zincrby(key, 2, 'one');
    expect(data).toBe('3');

    const { data: rangeData } = await zrange(key, 0, -1, { withScores: true });
    expect(rangeData).toMatchObject(['two', '2', 'one', '3']);
  });
});
