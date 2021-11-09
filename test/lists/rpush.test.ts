import { rpush, lrange } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('rpush command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, 'Hello', 'Upstash');
    expect(pushData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['Hello', 'Upstash']);
  });
});
