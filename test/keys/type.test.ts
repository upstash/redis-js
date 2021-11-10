import { set, type } from '../../src';
import { nanoid } from 'nanoid';

describe('type command', () => {
  it('basic', async () => {
    const key = nanoid();

    await set(key, 'Upstash');

    const { data } = await type(key);
    expect(data).toBe('string');
  });
});
