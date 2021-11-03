import { auth, echo } from '../src';

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
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;

    auth({ url, edgeUrl, token });

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });
});
