import { hset, hget } from '../../src';
import { nanoid } from 'nanoid';

describe('hset command', () => {
  it('basic', async () => {
    const myHash = nanoid();
    const field1 = nanoid();

    const { data: data1 } = await hset(myHash, field1, 'hey');
    expect(data1).toBe(1);

    const { data: data2 } = await hget(myHash, field1);
    expect(data2).toBe('hey');
  });
});
