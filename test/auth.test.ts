import { auth, echo } from '../src';

describe('api connection', () => {
  it('succeed', async () => {
    auth(
      process.env.UPSTASH_REDIS_REST_URL,
      process.env.UPSTASH_REDIS_REST_TOKEN
    );

    const { data, metadata } = await echo('hi');
    expect(data).toBe('hi');
    expect(metadata?.edge).toBeFalsy();
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
