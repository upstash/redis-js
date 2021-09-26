import { set, exists } from '../src';
import { nanoid } from 'nanoid';

describe('exists command', () => {
  it('single key', async () => {
    const key1 = nanoid();
    const value = nanoid();

    await set(key1, value);

    const { data } = await exists([key1]);
    expect(data).toBe(1);
  });

  it('multiple keys', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key3 = nanoid();
    const value = nanoid();

    await set(key1, value);
    await set(key2, value);

    const { data } = await exists([key1, key2, key3]);
    expect(data).toBe(2);
  });
});
