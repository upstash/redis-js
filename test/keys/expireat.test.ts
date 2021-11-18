import { set, exists, expireat } from '../../src';
import { nanoid } from 'nanoid';

describe('expireat command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 'Hello');

    const { data: data1 } = await exists(key);
    expect(data1).toBe(1);

    const { data: data2 } = await expireat(key, 1293840000);
    expect(data2).toBe(1);

    const { data: data3 } = await exists(key, { edge: false });
    expect(data3).toBe(0);
  });
});
