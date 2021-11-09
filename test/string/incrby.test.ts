import { set, incrby } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('incrby command', () => {
  const key = nanoid();

  it('basic', async () => {
    await set(key, 2);

    const { data } = await incrby(key, 3);
    expect(data).toBe(5);
  });
});
