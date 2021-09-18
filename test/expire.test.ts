import { set, ttl, expire } from '../src';
import { nanoid } from 'nanoid';

describe('expire command', () => {
  const key = 'mykey';
  const value = nanoid();

  // TODO:MEHMET
  it('single key', async () => {
    await set(key, value);

    const { data: expireData } = await expire(key, 10);
    expect(expireData).toBe(1);

    const { data: ttlData } = await ttl(key);
    expect(ttlData).toBeGreaterThan(0);
  });
});
