import { hset, hgetall } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('hgetall command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: data1 } = await hset(myHash, 'f1', 'v1', 'f2', 'v2');
    expect(data1).toBe(2);

    const { data: data2 } = await hgetall(myHash);

    expect(data2).toHaveLength(4);
  });
});
