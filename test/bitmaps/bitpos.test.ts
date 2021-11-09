import { set, bitpos } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('bitpos command', () => {
  it('just start', async () => {
    const key = nanoid();

    await set(key, '\xff\xf0\x00');

    const { data } = await bitpos(key, 0);
    expect(data).toBe(2);
  });

  it('start and end', async () => {
    const key = nanoid();

    await set(key, '\x00\xff\xf0');

    const { data } = await bitpos(key, 1, 0);
    expect(data).toBe(8);
  });
});
