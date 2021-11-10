import { exists, pexpireat, pttl, set } from '../../src';
import { nanoid } from 'nanoid';

describe('pexpireat command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 'Hello');

    const { data: data1 } = await exists(key);
    expect(data1).toBe(1);

    const { data: data2 } = await pexpireat(key, 1555555555005);
    expect(data2).toBe(1);

    const { data: data3 } = await pttl(key);
    expect(data3).toBe(-2);
  });
});
