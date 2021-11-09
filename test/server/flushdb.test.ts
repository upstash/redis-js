import { flushdb, auth } from '../../dist/main';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('flushdb command', () => {
  it('delete all keys current database', async () => {
    const { data } = await flushdb();
    expect(data).toBe('OK');
  });
});
