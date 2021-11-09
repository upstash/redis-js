import { lset, rpush, lrange, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('lset command', () => {
  it('basic', async () => {
    const myList = nanoid();

    const { data: pushData } = await rpush(myList, 'one', 'two', 'three');
    expect(pushData).toBe(3);

    const { data: data1 } = await lset(myList, 0, 'four');
    expect(data1).toBe('OK');

    const { data: data2 } = await lset(myList, -2, 'five');
    expect(data2).toBe('OK');

    const { data: rangeData } = await lrange(myList, 0, -1);
    expect(rangeData).toMatchObject(['four', 'five', 'three']);
  });
});
