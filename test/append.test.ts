import { set, append } from '../src';
import { nanoid } from 'nanoid';

describe('redis append command', () => {
  it('success', async () => {
    const key = nanoid();
    const value = nanoid();

    const { data: data1 } = await set(key, value);
    expect(data1).toBe('OK');

    const { data } = await append(key, value);
    expect(data).toBe(value.length * 2);
  });
});
