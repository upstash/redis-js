import { auth, get, set } from '../src';

describe('api connection', () => {
  it('missing URL', async () => {
    const url: string = '';
    const token: string = '';

    auth(url, token);

    const { error } = await get('key1');
    expect(error).toBe('Only absolute URLs are supported');
  });

  it('wrong URL', async () => {
    const url: string = 'https://google.com';
    const token: string = '123456';

    auth(url, token);

    const { error } = await get('key1');
    expect(error).toBe('This url does not address upstash');
  });

  it('wrong password', async () => {
    const url: string = process.env.UPSTASH_URL_WITH_TLS || '';
    const token: string = '123456';

    auth(url, token);

    const { status } = await get('key1');
    expect(status).toBe(401);
  });

  it('succeed', async () => {
    const url: string = process.env.UPSTASH_URL_WITH_TLS || '';
    const token: string = process.env.UPSTASH_TOKEN_WITH_TLS || '';

    auth(url, token);

    const { status, error } = await get('key1');
    expect(error).toBeUndefined();
    expect(status).toBe(200);
  });
});
