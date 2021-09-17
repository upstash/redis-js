import { set, get } from '../src';
import { nanoid } from 'nanoid';

describe('set command', () => {
  const key = 'mykey';
  const value = nanoid();

  it('save data', async () => {
    const { data: setData } = await set(key, value);
    expect(setData).toBe('OK');

    const { data: getData } = await get(key);
    expect(getData).toBe(value);
  });
});
