import { set, bitop } from '../src';
import { nanoid } from 'nanoid';

describe('bitop command', () => {
  it('and', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const dest = nanoid();

    await set(key1, 'ali');
    await set(key2, 'veli');

    const { data } = await bitop('AND', dest, [key1, key2]);
    expect(data).toBe(4);
  });

  it('or', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const dest = nanoid();

    await set(key1, 'ali');
    await set(key2, 'veli');

    const { data } = await bitop('OR', dest, [key1, key2]);
    expect(data).toBe(4);
  });

  it('xor', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const dest = nanoid();

    await set(key1, 'ali');
    await set(key2, 'veli');

    const { data } = await bitop('XOR', dest, [key1, key2]);
    expect(data).toBe(4);
  });

  it('not', async () => {
    const key1 = nanoid();
    const dest = nanoid();

    await set(key1, 'ali');

    const { data } = await bitop('XOR', dest, key1);
    expect(data).toBe(3);
  });
});
