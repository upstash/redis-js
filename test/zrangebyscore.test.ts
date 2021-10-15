import { zadd, zrangebyscore } from '../src';
import { nanoid } from 'nanoid';

describe('zrangebyscore command', () => {
  it('basic', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [
      10,
      'a',
      5,
      'b',
      15,
      'c',
      3,
      'd',
    ]);
    expect(addData).toBe(4);

    const { data: rangeData } = await zrangebyscore(key, '-inf', '+inf');
    expect(rangeData).toMatchObject(['d', 'b', 'a', 'c']);
  });

  it('with score', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [
      10,
      'a',
      5,
      'b',
      15,
      'c',
      3,
      'd',
    ]);
    expect(addData).toBe(4);

    const { data: rangeData } = await zrangebyscore(key, '+inf', '-inf', {
      withScores: true,
    });
    expect(rangeData).toMatchObject(['c', '15', 'a', '10', 'b', '5', 'd', '3']);
  });

  it('with score and limit', async () => {
    const key = nanoid();

    const { data: addData } = await zadd(key, [
      10,
      'a',
      5,
      'b',
      15,
      'c',
      3,
      'd',
    ]);
    expect(addData).toBe(4);

    const { data: rangeData } = await zrangebyscore(key, '+inf', '-inf', {
      withScores: true,
      limit: { offset: 1, count: 2 },
    });
    expect(rangeData).toMatchObject(['a', '10', 'b', '5']);
  });
});
