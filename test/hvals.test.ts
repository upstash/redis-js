import { hset, hvals } from '../src';
import { nanoid } from 'nanoid';

describe('hvals command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: data1 } = await hset(myHash, [
      'field1',
      'hello',
      'field2',
      'upstash',
    ]);
    expect(data1).toBe(2);

    const { data: data2 } = await hvals(myHash);
    expect(data2).toMatchObject(['hello', 'upstash']);
  });
});
