import { dbsize, flushdb } from '../src';

describe('dbsize command', () => {
  it('basic', async () => {
    await flushdb();

    const { data } = await dbsize();
    expect(data).toBe(0);
  });
});
