import { zadd, zrank } from '../dist/main';
import { nanoid } from 'nanoid';

describe('zrank command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [1, 'a', 2, 'b']);
    expect(addData).toBe(2);

    const { data } = await zrank(key, 'b');
    expect(data).toBe(1);
  });

  it('should be null', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [1, 'a', 2, 'b']);
    expect(addData).toBe(2);

    const { data } = await zrank(key, 'z');
    expect(data).toBeNull();
  });
});
