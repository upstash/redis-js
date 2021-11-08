import { hset, hlen } from '../dist/main';
import { nanoid } from 'nanoid';

describe('hlen command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: data1 } = await hset(myHash, [
      'field1',
      'hello',
      'field2',
      'upstash',
    ]);
    expect(data1).toBe(2);

    const { data: data2 } = await hlen(myHash);
    expect(data2).toBe(2);
  });
});
