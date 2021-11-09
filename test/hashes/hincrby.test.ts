import { hset, hincrby, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('hincrby command', () => {
  it('basic', async () => {
    const myHash = nanoid();
    const field1 = nanoid();

    const { data: data1 } = await hset(myHash, field1, '10');
    expect(data1).toBe(1);

    const { data: data2 } = await hincrby(myHash, field1, 1);
    expect(data2).toBe(11);

    const { data: data3 } = await hincrby(myHash, field1, -6);
    expect(data3).toBe(5);
  });
});
