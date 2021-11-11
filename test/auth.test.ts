import { auth, echo } from '../dist/main';

describe('api connection', () => {
  it('succeed', async () => {
    auth(
      process.env.UPSTASH_REDIS_REST_URL,
      process.env.UPSTASH_REDIS_REST_TOKEN
    );

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });

  it('edge URL', async () => {
    auth({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
      edgeUrl: process.env.UPSTASH_REDIS_EDGE_URL,
    });

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });
});
