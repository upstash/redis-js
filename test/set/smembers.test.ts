import { sadd, smembers } from '../../src';
import { nanoid } from 'nanoid';

describe('smembers command', () => {
  it('save data', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, 'Hello');
    expect(sadd1).toBe(1);

    const { data: sadd2 } = await sadd(key, 'World');
    expect(sadd2).toBe(1);

    const { data } = await smembers(key);
    expect(data).toContain('World');
    expect(data).toContain('Hello');
  });
});
