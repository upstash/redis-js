import { zadd, zrevrange } from '../src';
import { nanoid } from 'nanoid';

describe('zrevrange command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [
      2,
      'donatello',
      2,
      'leonardo',
      3,
      'michelangelo',
      4,
      'rafael',
    ]);
    expect(addData).toBe(4);

    const { data: range1 } = await zrevrange(key, 0, -1);
    expect(range1).toMatchObject([
      'rafael',
      'michelangelo',
      'leonardo',
      'donatello',
    ]);

    const { data: range2 } = await zrevrange(key, 3, 4);
    expect(range2).toMatchObject(['donatello']);
  });
});
