import { set, setrange } from '../src';
import { nanoid } from 'nanoid';

describe('setrange command', () => {
  it('basic', async () => {
    const key = nanoid();
    const value = 'Hello';

    await set(key, value);

    const { data: range } = await setrange(key, 10, 'World');
    expect(range).toBe(15);
  });
});
