import { hget, hsetnx } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('hsetnx command', () => {
  it('basic', async () => {
    const myHash = nanoid();
    const field1 = nanoid();

    const { data: data1 } = await hsetnx(myHash, field1, 'hey');
    expect(data1).toBe(1);

    const { data: data2 } = await hsetnx(myHash, field1, 'hi');
    expect(data2).toBe(0);

    const { data: data3 } = await hget(myHash, field1);
    expect(data3).toBe('hey');
  });
});
