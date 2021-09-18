import { msetnx, del } from '../src';

describe('msetnx command', () => {
  const key1 = 'key1001';
  const key2 = 'key1002';
  const key3 = 'key1003';

  it('multiple save', async () => {
    await del([key1, key2, key3]);

    const { data: data1 } = await msetnx([key1, 'hi', key2, 'hey']);
    expect(data1).toBe(1);

    const { data: data2 } = await msetnx([key2, 'hi', key3, 'hey']);
    expect(data2).toBe(0);
  });
});
