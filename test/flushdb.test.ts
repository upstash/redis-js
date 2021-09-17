import { flushdb } from '../src';

describe('flushdb command', () => {
  it('delete all keys current db', async () => {
    const { data } = await flushdb();
    expect(data).toBe('OK');
  });
});
