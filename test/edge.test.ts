import { set, get, auth } from '../src';
import { nanoid } from 'nanoid';

describe('edge request', () => {
  it('success', async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;

    auth({ url, edgeUrl, token });

    const key = nanoid();

    const set0 = await set(key, '1');
    // console.log('set0', set0);
    expect(set0.data).toBe('OK');
    expect(set0.config?.edge).toBeFalsy();

    const get0 = await get(key);
    expect(get0.data).toBe('1');
    expect(get0.config?.edge).toBeTruthy();
    expect(get0.config?.cache).toBeFalsy();
    // console.log('get0', get0);

    const set1 = await set(key, '2');
    expect(set1.data).toBe('OK');
    expect(set1.config?.edge).toBeFalsy();
    // console.log('set1', set1);

    const get1 = await get(key);
    expect(get1.data).toBe('1');
    expect(get1.config?.edge).toBeTruthy();
    expect(get1.config?.cache).toBeTruthy();
    // console.log('get1', get1);
  });
});
