import { auth, get, set } from '../src';
import { nanoid } from 'nanoid';

describe('api connection succeed', () => {
  it('should return null', async () => {
    const url: string = process.env.UPSTASH_URL || '';
    const token: string = process.env.UPSTASH_TOKEN || '';

    auth(url, token);

    const { status, error } = await get('key1');
    expect(error).toBeUndefined();
    expect(status).toBe(200);
  });
});
