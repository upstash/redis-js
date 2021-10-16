// import { zadd, zrevrank } from '../src';
import { nanoid } from 'nanoid';

describe('zrevrank command', () => {
  it('basic', async () => {
    const key = nanoid();

    // const { data: addData } = await zadd(key, [1, 'a', 2, 'b', 3, 'c']);
    // expect(addData).toBe(3);

    // const { data } = await zrevrank(key, 0, -1);
    // console.log(data);
    // expect(range1).toMatchObject(['c', 'b', 'a']);
  });
});
