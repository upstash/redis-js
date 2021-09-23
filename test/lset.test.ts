import { lset, rpush, lrange } from '../src';
import { nanoid } from 'nanoid';

describe('lset command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, ['one', 'two', 'three']);
    expect(pushData).toBe(3);

    const { data: data1 } = await lset(myList, 0, 'four');
    expect(data1).toBe('OK');

    const { data: data2 } = await lset(myList, -2, 'five');
    expect(data2).toBe('OK');

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['four', 'five', 'three']);
  });
});
