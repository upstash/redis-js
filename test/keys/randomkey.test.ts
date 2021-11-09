import { auth, randomkey, set } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('randomkey command', () => {
  it('basic', async () => {
    await set(nanoid(), nanoid());

    const { data } = await randomkey();
    expect(data).not.toBeNull();
  });
});
