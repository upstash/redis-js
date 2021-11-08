import { hmset, hget } from '../dist/main';
import { nanoid } from 'nanoid';

describe('hmset command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: data1 } = await hmset(myHash, [
      'field1',
      'hello',
      'field2',
      'upstash',
    ]);
    expect(data1).toBe('OK');

    const { data: data2 } = await hget(myHash, 'field1');
    expect(data2).toBe('hello');
  });
});
