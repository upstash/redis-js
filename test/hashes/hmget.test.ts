import { hset, hmget } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('hmget command', () => {
  it('basic', async () => {
    const myHash = nanoid();

    const { data: data1 } = await hset(
      myHash,
      'field1',
      'hello',
      'field2',
      'upstash'
    );
    expect(data1).toBe(2);

    const { data: data2 } = await hmget(myHash, 'field1', 'field2', 'field3');
    expect(data2).toMatchObject(['hello', 'upstash', null]);
  });
});
