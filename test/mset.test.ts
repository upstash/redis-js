import { mset, get } from '../src';
import { nanoid } from 'nanoid';

describe('mset command', () => {
  const key1 = 'key1';
  const value1 = nanoid();

  const key2 = 'key2';
  const value2 = nanoid();

  it('multiple save', async () => {
    const { data: setData } = await mset([key1, value1, key2, value2]);
    expect(setData).toBe('OK');

    const { data: getKey1 } = await get(key1);
    expect(getKey1).toBe(value1);

    const { data: getKey2 } = await get(key2);
    expect(getKey2).toBe(value2);
  });
});
