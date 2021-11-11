import { mset, mget } from '../../src';
import { nanoid } from 'nanoid';

describe('mget command', () => {
  it('multiple save', async () => {
    const key1 = nanoid();
    const value1 = nanoid();
    const key2 = nanoid();
    const value2 = nanoid();

    await mset(key1, value1, key2, value2);

    const { data: getKey1 } = await mget(key1, key2, 'nonexisting');
    expect(getKey1).toEqual(expect.arrayContaining([value1, value2, null]));
  });
});
