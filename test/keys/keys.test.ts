import { keys, mset, flushdb, auth } from '../../dist/main';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('keys command', () => {
  it('all keys', async () => {
    await flushdb();
    await mset('firstname', 'Jack', 'lastname', 'Stuntman', 'age', '35');

    const { data } = await keys('*');
    expect(data).toHaveLength(3);
  });

  it('matching pattern', async () => {
    await flushdb();
    await mset('firstname', 'Jack', 'lastname', 'Stuntman', 'age', '35');

    const { data } = await keys('*name*');
    expect(data).toHaveLength(2);
  });
});
