import { get, setnx } from '../src';
import { nanoid } from 'nanoid';

describe('setnx command', () => {
  it('remaining time', async () => {
    const key = nanoid();

    const { data: data1 } = await setnx(key, 'Hello');
    expect(data1).toBe(1);

    const { data: data2 } = await setnx(key, 'World');
    expect(data2).toBe(0);

    const { data } = await get(key);
    expect(data).toBe('Hello');
  });
});
