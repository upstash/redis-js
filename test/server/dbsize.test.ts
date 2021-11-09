import { dbsize, flushdb, auth } from '../../dist/main';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('dbsize command', () => {
  it('basic', async () => {
    await flushdb();

    const { data } = await dbsize();
    expect(data).toBe(0);
  });
});
