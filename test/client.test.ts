import upstash from '../src';

describe('api connection', () => {
  it('new instance', async () => {
    const { echo } = upstash(
      process.env.UPSTASH_REDIS_REST_URL!,
      process.env.UPSTASH_REDIS_REST_TOKEN!
    );

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });

  it('new instance object', async () => {
    const { echo } = upstash({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });

  it('new instance with edge', async () => {
    const { echo } = upstash({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      edgeUrl: process.env.UPSTASH_REDIS_EDGE_URL,
    });

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });

  it('new instance auto credential', async () => {
    const { echo } = upstash();

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });
});
