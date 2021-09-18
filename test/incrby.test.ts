import { set, incrby } from '../src';

describe('incrby command', () => {
  const key = 'myKey';

  it('basic', async () => {
    await set(key, 2);

    const { data } = await incrby(key, 3);
    expect(data).toBe(5);
  });
});
