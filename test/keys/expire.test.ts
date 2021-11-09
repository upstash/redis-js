import { set, ttl, expire } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('expire command', () => {
  it('single key', async () => {
    const key = nanoid();
    const value = nanoid();

    await set(key, value);

    const { data: expireData } = await expire(key, 10);
    expect(expireData).toBe(1);
  });
});
