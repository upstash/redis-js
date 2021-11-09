import { rpoplpush, rpush, lrange, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('rpoplpush command', () => {
  it('basic', async () => {
    const myList = nanoid();
    const myOtherList = nanoid();

    const { data: pushData } = await rpush(myList, '1', '2', '3');
    expect(pushData).toBe(3);

    const { data: lastValue } = await rpoplpush(myList, myOtherList);
    expect(lastValue).toBe('3');

    const { data: list1 } = await lrange(myList, 0, -1);
    expect(list1).toMatchObject(['1', '2']);

    const { data: list2 } = await lrange(myOtherList, 0, -1);
    expect(list2).toMatchObject(['3']);
  });
});
