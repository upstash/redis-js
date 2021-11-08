import { sadd, sismember } from '../dist/main';
import { nanoid } from 'nanoid';

describe('sismember command', () => {
  it('save data', async () => {
    const key = nanoid();

    const { data: sadd1 } = await sadd(key, ['one']);
    expect(sadd1).toBe(1);

    const { data: data1 } = await sismember(key, 'one');
    expect(data1).toBe(1);

    const { data: data2 } = await sismember(key, 'two');
    expect(data2).toBe(0);
  });
});
