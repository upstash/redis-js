import { set, exists } from '../../src';
import { nanoid } from 'nanoid';

describe('exists command', () => {
  it('single key', async () => {
    const key = nanoid();

    await set(key, 'value');

    const { data } = await exists(key);
    expect(data).toBe(1);
  });

  it('multiple keys', async () => {
    const key1 = nanoid();
    const key2 = nanoid();

    await set(key1, 'value1');
    await set(key2, 'value2');

    const { data } = await exists(key1, key2, 'key3');
    expect(data).toBe(2);
  });
});
