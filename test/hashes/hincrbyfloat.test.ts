import { hset, hincrbyfloat, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('hincrbyfloat command', () => {
  it('basic', async () => {
    const myHash = nanoid();
    const field1 = nanoid();

    const { data: data1 } = await hset(myHash, field1, '10.5');
    expect(data1).toBe(1);

    const { data: data2 } = await hincrbyfloat(myHash, field1, 0.1);
    expect(data2).toBe('10.6');

    const { data: data3 } = await hincrbyfloat(myHash, field1, -5);
    expect(data3).toBe('5.6');
  });
});
