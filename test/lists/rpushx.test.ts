import { rpushx, rpush, lrange, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('rpushx command', () => {
  it('basic', async () => {
    const myList = nanoid();
    const myOtherList = nanoid();

    const { data: data1 } = await rpush(myList, 'Hello');
    expect(data1).toBe(1);

    const { data: data2 } = await rpushx(myList, 'Upstash');
    expect(data2).toBe(2);

    const { data: data3 } = await rpushx(myOtherList, 'Upstash');
    expect(data3).toBe(0);

    const { data: rangeData1 } = await lrange(myList, 0, -1);
    expect(rangeData1).toMatchObject(['Hello', 'Upstash']);

    const { data: rangeData2 } = await lrange(myOtherList, 0, -1);
    expect(rangeData2).toMatchObject([]);
  });
});
