import { llen, rpush, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('llen command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, 'Hello', 'Upstash');
    expect(pushData).toBe(2);

    const { data } = await llen(myList);
    expect(data).toBe(2);
  });
});
