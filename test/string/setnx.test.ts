import { get, setnx, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('setnx command', () => {
  it('remaining time', async () => {
    const key = nanoid();

    const { data: data1 } = await setnx(key, 'Hello');
    expect(data1).toBe(1);

    const { data: data2 } = await setnx(key, 'World');
    expect(data2).toBe(0);

    const { data: data3 } = await get(key);
    expect(data3).toBe('Hello');
  });
});
