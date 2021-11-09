import { zadd, zpopmax, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zpopmax command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b');
    expect(addData).toBe(2);

    const { data: rangeData } = await zpopmax(key);
    expect(rangeData).toMatchObject(['a', '10']);
  });

  it('with count', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, 10, 'a', 5, 'b', 15, 'c');
    expect(addData).toBe(3);

    const { data: rangeData } = await zpopmax(key, 2);
    expect(rangeData).toMatchObject(['c', '15', 'a', '10']);
  });
});
