import { set, strlen } from '../src';
import { nanoid } from 'nanoid';

describe('strlen command', () => {
  it('return value', async () => {
    const key = nanoid();
    const value = 'Hello world';

    await set(key, value);

    const { data } = await strlen(key);
    expect(data).toBe(value.length);
  });

  it('return no existing', async () => {
    const { data } = await strlen('nonexisting');
    expect(data).toBe(0);
  });
});
