import { rpush, lrange, rpop, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('rpop command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, '1', '2', '3');
    expect(pushData).toBe(3);

    const { data: popData } = await rpop(myList);
    expect(popData).toBe('3');

    const { data } = await lrange(myList, 0, -1);
    expect(data).toMatchObject(['1', '2']);
  });
});
