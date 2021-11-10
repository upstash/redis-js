import { set, get, auth } from '../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('promise then', () => {
  it('basic', (done) => {
    const key = nanoid();

    set(key, 'hello')
      .then(({ data }) => {
        expect(data).toBe('OK');
      })
      .finally(() => {
        done();
      });
  });
});
