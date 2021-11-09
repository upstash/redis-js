import { lrange, lpush, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('lpush command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await lpush(myList, 'Hello', 'Upstash');
    expect(pushData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['Upstash', 'Hello']);
  });
});
