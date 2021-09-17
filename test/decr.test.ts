import { set, decr } from '../src';

describe('decr command', () => {
  const key = 'mykey';

  it('basic', async () => {
    await set(key, '100');

    const { data } = await decr(key);
    expect(data).toBe(99);
  });
});
