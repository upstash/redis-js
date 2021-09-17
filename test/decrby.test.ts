import { set, decrby } from '../src';

describe('decr command', () => {
  const key = 'mykey';

  it('basic', async () => {
    await set(key, '100');

    const { data } = await decrby(key, 99);
    expect(data).toBe(1);
  });
});
