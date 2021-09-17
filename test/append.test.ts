import { set, append } from '../src';
import { nanoid } from 'nanoid';

describe('redis append command', () => {
  it('success', async () => {
    const key = nanoid();
    const value = nanoid();

    await set(key, value);
    const { data } = await append(key, value);
    expect(data).toBe(value.length * 2);
  });
});
