import { lrange, rpush, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('lrange command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, 'Hello', 'Upstash');
    expect(pushData).toBe(2);

    const { data: rangeData } = await lrange(myList, 0, 0);
    expect(rangeData).toMatchObject(['Hello']);
  });

  it('empty list', async () => {
    const myEmptyList = nanoid();

    const { data } = await lrange(myEmptyList, 0, 0);
    expect(data).toMatchObject([]);
  });
});
