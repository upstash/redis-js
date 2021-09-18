import { mset, mget } from '../src';
import { nanoid } from 'nanoid';

describe('mget command', () => {
  const key1 = 'key1';
  const value1 = nanoid();

  const key2 = 'key2';
  const value2 = nanoid();

  it('multiple save', async () => {
    await mset([key1, value1, key2, value2]);

    const { data: getKey1 } = await mget([key1, key2, 'nonexisting']);
    expect(getKey1).toEqual(expect.arrayContaining([value1, value2, null]));
  });
});
