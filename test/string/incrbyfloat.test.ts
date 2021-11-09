import { set, incrbyfloat, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('incrbyfloat command', () => {
  it('basic', async () => {
    const key = nanoid();
    const value1 = 2.3;
    const value2 = 0.4;

    await set(key, value1);

    const { data } = await incrbyfloat(key, value2);
    expect(data).toBe((value1 + value2).toString());
  });
});
