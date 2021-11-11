import { zadd, zremrangebylex, zrange } from '../../src';
import { nanoid } from 'nanoid';

describe('zremrangebylex command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(
      key,
      1,
      'donatello',
      2,
      'leonardo',
      3,
      'michelangelo',
      4,
      'rafael'
    );
    expect(addData).toBe(4);

    const { data } = await zremrangebylex(key, '[d', '[n');
    expect(data).toBe(3);

    const { data: rangeData } = await zrange(key, 0, -1);
    expect(rangeData).toMatchObject(['rafael']);
  });
});
