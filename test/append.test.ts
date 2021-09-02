import { append } from '../src';
import { nanoid } from 'nanoid';

describe('redis append command', () => {
  it('success', async () => {
    const key = nanoid();
    const value = nanoid();

    const { data, error } = await append(key, value);
    expect(error).toBeUndefined();
    expect(data).toBe(value.length);
  });
});
