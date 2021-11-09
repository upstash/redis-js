import { info, auth } from '../../dist/main';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('info command', () => {
  it('basic', async () => {
    const { data } = await info();
    expect(data).toContain('# Server');
  });
});
