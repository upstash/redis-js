import { lrange, rpush } from '../src';
import { nanoid } from 'nanoid';

describe('lrange command', () => {
  it('basic', async () => {
    const myList = nanoid();
    const value1 = 'Hello';
    const value2 = 'Upstash';

    const { data: pushData } = await rpush(myList, [value1, value2]);
    expect(pushData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, 0);
    expect(rangeData).toMatchObject([value1]);
  });

  it('empty list', async () => {
    const myEmptyList = nanoid();

    const { data } = await lrange(myEmptyList, 0, 0);
    expect(data).toMatchObject([]);
  });
});
