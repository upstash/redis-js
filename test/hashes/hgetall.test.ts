import { hset, hgetall, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('hgetall command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: data1 } = await hset(myHash, 'f1', 'v1', 'f2', 'v2');
    expect(data1).toBe(2);

    const { data: data2 } = await hgetall(myHash);

    expect(data2).toHaveLength(4);
  });
});
