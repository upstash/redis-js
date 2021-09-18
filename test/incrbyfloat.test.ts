import { set, incrbyfloat } from '../src';

describe('incrbyfloat command', () => {
  const key = 'mykey';
  const value1 = 2.3;
  const value2 = 0.4;

  it('basic', async () => {
    await set(key, value1);

    const { data } = await incrbyfloat(key, value2);
    expect(data).toBe((value1 + value2).toString());
  });
});
