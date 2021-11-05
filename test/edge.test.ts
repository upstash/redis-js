import { set, get, auth } from '../src';
import { nanoid } from 'nanoid';

describe('edge request', () => {
  it('success', async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL!;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
    const edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;

    auth({ url, edgeUrl, token });

    const key = nanoid();

    const set0 = await set(key, '1');
    expect(set0.data).toBe('OK');
    expect(set0.metadata?.edge).toBeFalsy();

    const get0 = await get(key);
    expect(get0.data).toBe('1');
    if (edgeUrl) {
      expect(get0.metadata?.edge).toBeTruthy();
      expect(get0.metadata?.cache).toBe('miss');
    }

    const set1 = await set(key, '2');
    expect(set1.data).toBe('OK');
    expect(set1.metadata?.edge).toBeFalsy();

    const get1 = await get(key);
    if (!edgeUrl) {
      expect(get1.data).toBe('2');
    } else {
      expect(get1.data).toBe('1');
      expect(get1.metadata?.edge).toBeTruthy();
      expect(get1.metadata?.cache).toBe('hit');
    }
  });

  it('edge url not found', async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL!;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

    expect.assertions(1);
    try {
      auth({ url, token, edgeUrl: null, readFromEdge: true });
    } catch (e) {
      expect(e.message).toBe(
        'readFromEdge is set to true but the Edge Url is missing'
      );
    }
  });

  it('edge url not found but readFromEdge is false should success', async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL!;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

    expect(auth({ url, token, edgeUrl: null, readFromEdge: false })).toBe(
      undefined
    );
  });

  it('edge url not found 1', async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL!;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
    const edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;

    expect.assertions(1);
    try {
      auth({ url, edgeUrl, token, readFromEdge: false });

      const get0 = await get('asddfghj', { edge: true });
      expect(get0.data).toBeNull();
    } catch (e) {
      if (!edgeUrl) {
        expect(e.message).toBe(
          `"edge: true" is being used but the Edge Url is missing`
        );
      }
    }
  });
});
