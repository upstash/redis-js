import { set, setrange } from '../src';
import { nanoid } from 'nanoid';

describe('setrange command', () => {
  it('basic', async () => {
    const key = nanoid();
    const value = 'Hello';

    await set(key, value);

    const { data } = await setrange(key, 10, 'World');
    expect(data).toBe(15);
  });
});
