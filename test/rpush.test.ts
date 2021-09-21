import { rpush, lrange } from '../src';
import { nanoid } from 'nanoid';

describe('rpush command', () => {
  it('basic', async () => {
    const myList = nanoid();
    const value1 = 'Hello';
    const value2 = 'Upstash';

    const { data: pushData } = await rpush(myList, [value1, value2]);
    expect(pushData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject([value1, value2]);
  });
});
