import { auth, echo } from '../src';

describe('api connection', () => {
  it('succeed', async () => {
    const url: string = process.env.UPSTASH_REDIS_TOKEN ?? '';
    const token: string = process.env.UPSTASH_REDIS_URL ?? '';

    console.log(process.env);
    expect(url).toBe('');

    // auth(url, token);
    //
    // const { data } = await echo('hi');
    // expect(data).toBe('hi');
  });

  it('missing URL', async () => {
    const url: string = '';
    const token: string = '';

    auth(url, token);

    const { error } = await echo('hi');
    expect(error).toBe('Only absolute URLs are supported');
  });
});
