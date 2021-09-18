import { mset, del } from '../src';

describe('del command', () => {
  const key1 = 'mykey1';
  const key2 = 'mykey2';
  const key3 = 'mykey3';

  it('basic', async () => {
    await mset([key1, 'value', key2, 'value']);

    const { data } = await del([key1, key2, key3]);
    expect(data).toBe(2);
  });
});
