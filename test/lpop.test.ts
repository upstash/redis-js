import { lpop, rpush, lrange } from '../src';
import { nanoid } from 'nanoid';

describe('lpop command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, ['1', '2', '3', '4', '5']);
    expect(pushData).toBe(5);

    const { data: firstData } = await lpop(myList);
    expect(firstData).toBe('1');

    // TODO: backend bug?
    const { data: first3Data } = await lpop(myList, 2);
    expect(first3Data).toMatchObject(['2', '3', '4']);

    const { data } = await lrange(myList, 0, -1);
    expect(data).toMatchObject(['5']);
  });
});
