import { get, set } from '../src';
import { nanoid } from 'nanoid';

describe('redis set command', () => {
  it('save', async () => {
    const key = 'key1';
    const value = nanoid();

    const { error: setError } = await set(key, value);
    expect(setError).toBeUndefined();

    const { data, error } = await get(key);
    expect(error).toBeUndefined();
    expect(data).toBe(value);
  });
});
