import { rpush, ltrim, lrange, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('ltrim command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, 'one', 'two', 'three');
    expect(pushData).toBe(3);

    const { data: trimData } = await ltrim(myList, 1, -1);
    expect(trimData).toBe('OK');

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['two', 'three']);
  });
});
