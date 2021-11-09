import { setbit, getbit, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('set command', () => {
  it('save data', async () => {
    const key = nanoid();

    const { data: data1 } = await setbit(key, 7, 1);
    expect(data1).toBe(0);

    const { data: data2 } = await getbit(key, 0);
    expect(data2).toBe(0);

    const { data: data3 } = await getbit(key, 7);
    expect(data3).toBe(1);
  });
});
