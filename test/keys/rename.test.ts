import { set, rename, get } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('rename command', () => {
  it('basic', async () => {
    const key = nanoid();
    const newKey = nanoid();
    const value = 'Hello';

    await set(key, value);

    const { data } = await rename(key, newKey);
    expect(data).toBe('OK');

    const { data: data1 } = await get(newKey);
    expect(data1).toBe(value);
  });
});
