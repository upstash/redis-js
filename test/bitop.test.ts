import { set, bitop } from '../src';
import { nanoid } from 'nanoid';

describe('redis bitop command', () => {
  const key1 = 'key1';
  const key2 = 'key2';
  const dest = nanoid();

  it('and', async () => {
    await set(key1, 'ali');
    await set(key2, 'veli');

    const { data } = await bitop('AND', dest, [key1, key2]);
    expect(data).toBe(4);
  });

  it('or', async () => {
    await set(key1, 'ali');
    await set(key2, 'veli');

    const { data } = await bitop('OR', dest, [key1, key2]);
    expect(data).toBe(4);
  });

  it('xor', async () => {
    await set(key1, 'ali');
    await set(key2, 'veli');

    const { data } = await bitop('XOR', dest, [key1, key2]);
    expect(data).toBe(4);
  });

  it('not', async () => {
    await set(key1, 'ali');

    const { data } = await bitop('XOR', dest, key1);
    expect(data).toBe(3);
  });
});
