import { set, exists, expireat } from '../src';

describe('expireat command', () => {
  it('basic', async () => {
    const { data } = await expireat('key/null');
    expect(data).toBe(null);
  });
});
