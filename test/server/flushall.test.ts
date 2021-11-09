import { flushall, auth } from '../../dist/main';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('flushdb command', () => {
  it('delete all keys and all database', async () => {
    const { data } = await flushall();
    expect(data).toBe('OK');
  });
});
