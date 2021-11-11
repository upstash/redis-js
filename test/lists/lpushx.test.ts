import { lpush, lrange, lpushx } from '../../src';
import { nanoid } from 'nanoid';

describe('lpushx command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await lpush(myList, '1');
    expect(pushData).toBe(1);

    const { data: pushxData } = await lpushx(myList, '2');
    expect(pushxData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['2', '1']);
  });

  it('empty list', async () => {
    const myList = nanoid();

    const { data: pushxData } = await lpushx(myList, '1');
    expect(pushxData).toBe(0);

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject([]);
  });
});
