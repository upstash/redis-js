import { lindex, rpush } from '../src';
import { nanoid } from 'nanoid';

describe('lindex command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, ['Hello', 'Upstash']);
    expect(pushData).toBe(2);

    const { data } = await lindex(myList, 0);
    expect(data).toBe('Hello');

    const { data: nullData } = await lindex(myList, 99);
    expect(nullData).toBeNull();
  });
});
