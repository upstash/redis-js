import { set, bitcount } from '../../src';
import { nanoid } from 'nanoid';

describe('bitcount command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 'foobar');

    const { data } = await bitcount(key);
    expect(data).toBe(26);
  });

  it('with range', async () => {
    const key = nanoid();

    await set(key, 'foobar');

    const { data } = await bitcount(key, 0, 0);
    expect(data).toBe(4);
  });
});

// function bitCount (n) {
//   n = n - ((n >> 1) & 0x55555555)
//   n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
//   return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
// }
// bitCount("upstash".charCodeAt(0)) // u = 5
