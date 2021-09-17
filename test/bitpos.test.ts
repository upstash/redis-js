import { set, bitpos } from '../src';

describe('bitpos command', () => {
  const key = 'mykey';

  it('just start', async () => {
    await set(key, '\xff\xf0\x00');
    const { data } = await bitpos(key, 0);
    expect(data).toBe(2);
  });

  it('start and end', async () => {
    await set(key, '\x00\xff\xf0');
    const { data } = await bitpos(key, 1, 0);
    expect(data).toBe(8);
  });
});
