import { zadd, zlexcount, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zlexcount command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(
      key,
      0,
      'a',
      0,
      'b',
      0,
      'c',
      0,
      'd',
      0,
      'e'
    );
    expect(addData).toBe(5);

    const { data: count } = await zlexcount(key, '-', '+');
    expect(count).toBe(5);

    const { data } = await zlexcount(key, '[b', '[c');
    expect(data).toBe(2);
  });
});
