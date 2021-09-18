import { mset, get } from '../src';
import { nanoid } from 'nanoid';

describe('mset command', () => {
  it('multiple save', async () => {
    const key1 = nanoid();
    const value1 = nanoid();
    const key2 = nanoid();
    const value2 = nanoid();

    await mset([key1, value1, key2, value2]);

    const { data: data1 } = await get(key1);
    expect(data1).toBe(value1);

    const { data: data2 } = await get(key2);
    expect(data2).toBe(value2);
  });
});
