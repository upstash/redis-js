import { set, get, auth } from '../dist/main';
import { nanoid } from 'nanoid';

describe('edge request', () => {
  it('success', async () => {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;

    auth({ url, edgeUrl, token });

    const key = nanoid();

    const set0 = await set(key, '1');
    console.log(set0);

    const get0 = await get(key);
    console.log(get0);
  });

  // it('edge url not found', async () => {
  //   const url = process.env.UPSTASH_REDIS_REST_URL;
  //   const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  //
  //   auth({ url, token, readFromEdge: true });
  //
  //   const get0 = await get('asddfghj');
  //   expect(get0.error).toBe('You need to set Edge Url to read from edge.');
  //   // console.log('get0', get0);
  // });
  //
  // it('edge url not found 2', async () => {
  //   const url = process.env.UPSTASH_REDIS_REST_URL;
  //   const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  //
  //   auth({ url, token, readFromEdge: false });
  //
  //   const get0 = await get('asddfghj', { edge: true });
  //   expect(get0.error).toBe('You need to set Edge Url to read from edge.');
  //   // console.log('get0', get0);
  // });
  //
  // it('edge url not found 1', async () => {
  //   const url = process.env.UPSTASH_REDIS_REST_URL;
  //   const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  //   const edgeUrl = process.env.UPSTASH_REDIS_EDGE_URL;
  //
  //   auth({ url, edgeUrl, token, readFromEdge: false });
  //
  //   const get0 = await get('asddfghj', { edge: true });
  //   if (!edgeUrl) {
  //     expect(get0.error).toBe('You need to set Edge Url to read from edge.');
  //   } else {
  //     expect(get0.data).toBeNull();
  //   }
  // });
});
