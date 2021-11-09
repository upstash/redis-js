import { set, setrange, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});
describe('setrange command', () => {
  it('basic', async () => {
    const key = nanoid();
    const value = 'Hello';

    await set(key, value);

    const { data } = await setrange(key, 10, 'World');
    expect(data).toBe(15);
  });
});
