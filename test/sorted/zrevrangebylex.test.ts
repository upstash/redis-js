import { zadd, zrevrangebylex, auth } from '../../dist/main';
import { nanoid } from 'nanoid';

beforeAll(() => {
  auth(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
});

describe('zrevrangebylex command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(
      key,
      '0',
      'a',
      '0',
      'b',
      '0',
      'c',
      '0',
      'd',
      '0',
      'e'
    );
    expect(addData).toBe(5);

    const { data: range1 } = await zrevrangebylex(key, '[c', '-');
    expect(range1).toMatchObject(['c', 'b', 'a']);
  });

  it('with limit', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(
      key,
      '0',
      'a',
      '0',
      'b',
      '0',
      'c',
      '0',
      'd',
      '0',
      'e'
    );
    expect(addData).toBe(5);

    const { data: range1 } = await zrevrangebylex(
      key,
      '[c',
      '-',
      'LIMIT',
      1,
      2
    );
    expect(range1).toMatchObject(['b', 'a']);
  });
});
