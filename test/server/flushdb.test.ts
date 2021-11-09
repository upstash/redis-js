import { flushdb } from '../../dist/main';

describe('flushdb command', () => {
  it('delete all keys current database', async () => {
    const { data } = await flushdb();
    expect(data).toBe('OK');
  });
});
