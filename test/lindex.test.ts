import { lindex, rpush } from '../src';
import { nanoid } from 'nanoid';

describe('lindex command', () => {
  it('basic', async () => {
    const myList = nanoid();
    const value1 = 'Hello';
    const value2 = 'Upstash';

    const { data: pushData } = await rpush(myList, [value1, value2]);
    expect(pushData).toBe(2);

    const { data } = await lindex(myList, 0);
    expect(data).toBe(value1);

    const { data: nullData } = await lindex(myList, 99);
    expect(nullData).toBeNull();
  });
});
