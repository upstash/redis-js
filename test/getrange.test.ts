import { getrange, set } from '../src';
import { nanoid } from 'nanoid';

describe('getrange command', () => {
  it('basic', async () => {
    const key = nanoid();
    const value = 'This is a string';

    await set(key, value);

    const { data } = await getrange(key, 0, 3);
    expect(data).toBe('This');
  });
});
