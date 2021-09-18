import { set, incr } from '../src';

describe('incr command', () => {
  const key = 'myKey';

  it('basic', async () => {
    await set(key, 2);

    const { data } = await incr(key);
    expect(data).toBe(3);
  });
});
