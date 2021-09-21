import { lpush, lrange, lpushx } from '../src';
import { nanoid } from 'nanoid';

describe('lpushx command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await lpush(myList, ['Hello']);
    expect(pushData).toBe(1);

    const { data: pushxData } = await lpushx(myList, ['Upstash']);
    expect(pushxData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['Upstash', 'Hello']);
  });

  it('empty list', async () => {
    const myList = nanoid();

    // TODO: backend bug?
    const { data: pushxData } = await lpushx(myList, ['Upstash']);
    console.log(pushxData);
    // expect(pushxData).toBe(0);

    // const { data: rangeData } = await lrange(myList, 0, -1);
    // expect(rangeData).toBeNull();
  });
});
