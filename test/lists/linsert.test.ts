import { rpush, linsert, lrange } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('linsert command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, 'Hello', 'Upstash');
    expect(pushData).toBe(2);

    const { data } = await linsert(myList, 'BEFORE', 'Upstash', 'Merhaba');
    expect(data).toBe(3);

    const { data: nullData } = await lrange(myList, 0, -1);
    expect(nullData).toMatchObject(['Hello', 'Merhaba', 'Upstash']);
  });
});
