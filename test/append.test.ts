import { set, append } from '../src';
import { nanoid } from 'nanoid';

describe('redis append command', () => {
  const key = 'key';
  const value = nanoid();

  it('success', async () => {
    await set(key, value);
    const { data } = await append(key, value);
    expect(data).toBe(value.length * 2);
  });
});
