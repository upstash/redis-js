import { nanoid } from 'nanoid';
import { get, set } from '../src';

describe('redis get command', () => {
  it('should return null', async () => {
    const { data, error } = await get('asdfghjkl');
    expect(data).toEqual(null);
    expect(error).toBeUndefined();
  });

  it('should return a value', async () => {
    const key = 'key1';
    const value = nanoid();

    const { error: setError } = await set(key, value);
    expect(setError).toBeUndefined();

    const { data, error } = await get(key);
    expect(error).toBeUndefined();
    expect(data).toBe(value);
  });
});
