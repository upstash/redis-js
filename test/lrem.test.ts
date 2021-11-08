import { lrange, lrem, rpush } from '../dist/main';
import { nanoid } from 'nanoid';

describe('lrem command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, [
      'hello',
      'hello',
      'foo',
      'hello',
    ]);
    expect(pushData).toBe(4);

    const { data: removeData } = await lrem(myList, -2, 'hello');
    expect(removeData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['hello', 'foo']);
  });
});
