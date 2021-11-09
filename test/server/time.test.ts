import { time, auth } from '../../dist/main';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('time command', () => {
  it('basic', async () => {
    const { data } = await time();
    expect(data).toBeInstanceOf(Array);
  });
});
