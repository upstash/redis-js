import { mset, set, touch, unlink } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('unlink command', () => {
  it('basic', async () => {
    const key1 = nanoid();
    const key2 = nanoid();

    await mset(key1, 'Hello', key2, 'Upstash');

    const { data } = await unlink(key1, key2, 'key3');
    expect(data).toBe(2);
  });
});
