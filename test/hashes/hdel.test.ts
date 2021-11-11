import { hset, hdel } from '../../src';
import { nanoid } from 'nanoid';

describe('hdel command', () => {
  it('basic', async () => {
    const myHash = nanoid();
    const field1 = nanoid();

    const { data: data1 } = await hset(myHash, field1, 'value');
    expect(data1).toBe(1);

    const { data: data2 } = await hdel(myHash, field1);
    expect(data2).toBe(1);
  });
});
