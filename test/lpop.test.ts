import { lpop, rpush, lrange } from '../dist/main';
import { nanoid } from 'nanoid';

describe('lpop command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, ['1', '2', '3']);
    expect(pushData).toBe(3);

    const { data: deletedData } = await lpop(myList);
    expect(deletedData).toBe('1');

    const { data } = await lrange(myList, 0, -1);
    expect(data).toMatchObject(['2', '3']);
  });
});
