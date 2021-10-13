import { zadd, zcard } from '../src';
import { nanoid } from 'nanoid';

describe('zcard command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [1, 'one', 2, 'two']);
    expect(addData).toBe(2);

    const { data } = await zcard(key);
    expect(data).toBe(2);
  });
});
