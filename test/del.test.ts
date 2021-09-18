import { mset, del } from '../src';

describe('del command', () => {
  const key1 = 'myKey1';
  const key2 = 'myKey2';
  const key3 = 'myKey3';

  it('basic', async () => {
    await mset([key1, 'value', key2, 'value']);

    const { data } = await del([key1, key2, key3]);
    expect(data).toBe(2);
  });
});
