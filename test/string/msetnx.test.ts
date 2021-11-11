import { msetnx, del } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('msetnx command', () => {
  it('multiple save', async () => {
    const key1 = nanoid();
    const key2 = nanoid();
    const key3 = nanoid();

    await del([key1, key2, key3]);

    const { data: data1 } = await msetnx(key1, 'hi', key2, 'hey');
    expect(data1).toBe(1);

    const { data: data2 } = await msetnx(key2, 'hi', key3, 'hey');
    expect(data2).toBe(0);
  });
});
