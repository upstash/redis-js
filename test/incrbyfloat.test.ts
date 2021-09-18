import { set, incrbyfloat } from '../src';

describe('incrbyfloat command', () => {
  const key = 'myKey';

  it('basic', async () => {
    await set(key, 2.3);

    const { data } = await incrbyfloat(key, 0.1);
    expect(data).toBe('2.4');
  });
});
