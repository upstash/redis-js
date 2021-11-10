import { set, decrby } from '../../src';
import { nanoid } from 'nanoid';

describe('decrby command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, '100');

    const { data } = await decrby(key, 99);
    expect(data).toBe(1);
  });
});
