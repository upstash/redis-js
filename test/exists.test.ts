import { set, exists } from '../src';
import { nanoid } from 'nanoid';

describe('exists command', () => {
  const key1 = 'mykey1';
  const key2 = 'mykey2';
  const key3 = 'mykey3';
  const value = nanoid();

  it('single key', async () => {
    await set(key1, value);

    const { data } = await exists(key1);
    expect(data).toBe(1);
  });

  it('multiple keys', async () => {
    await set(key1, value);
    await set(key2, value);

    const { data } = await exists([key1, key2, key3]);
    expect(data).toBe(2);
  });
});
