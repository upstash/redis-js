import { auth, echo } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('echo command', () => {
  it('basic', async () => {
    const value = nanoid();

    const { data } = await echo(value);
    expect(data).toBe(value);
  });
});
