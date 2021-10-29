import { auth, echo } from '../src';

describe('api connection', () => {
  it('succeed', async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    auth({ url, token });

    const { data } = await echo('hi');
    expect(data).toBe('hi');
  });

  it('missing URL', async () => {
    const url: string = '';
    const token: string = '';

    auth({ url, token });

    const { error } = await echo('hi');
    expect(error).toBe('Only absolute URLs are supported');
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
