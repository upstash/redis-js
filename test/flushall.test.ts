import { flushall } from '../dist/main';

describe('flushdb command', () => {
  it('delete all keys and all database', async () => {
    const { data } = await flushall();
    expect(data).toBe('OK');
  });
});
