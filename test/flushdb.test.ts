import { flushdb } from '../src';

describe('flushdb command', () => {
  it('delete all keys current database', async () => {
    const { data } = await flushdb();
    expect(data).toBe('OK');
  });
});
