import { set, append } from '../src';
import { nanoid } from 'nanoid';

describe('append command', () => {
  const key = 'mykey';
  const value = nanoid();

  it('success', async () => {
    await set(key, value);
    const { data } = await append(key, value);
    expect(data).toBe(value.length * 2);
  });
});
