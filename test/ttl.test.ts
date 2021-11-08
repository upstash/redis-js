import { set, ttl, expire } from '../dist/main';
import { nanoid } from 'nanoid';

describe('ttl command', () => {
  it('remaining time', async () => {
    const key = nanoid();

    await set(key, 'a');

    const { data: expireData } = await expire(key, 10);
    expect(expireData).toBe(1);

    const { data: ttlData } = await ttl(key);
    expect(ttlData).toBeGreaterThanOrEqual(0);
  });

  it('key does not exist', async () => {
    const key = nanoid();

    await set(key, 'a');

    const { data: expireData } = await expire(key, 1);
    expect(expireData).toBe(1);

    const { data: ttlData } = await ttl(key);
    expect(ttlData).toBeGreaterThanOrEqual(-2);
  });

  it('key exists but has no associated expire', async () => {
    const key = nanoid();

    await set(key, 'a');

    const { data: ttlData } = await ttl(key);
    expect(ttlData).toBeGreaterThanOrEqual(-1);
  });
});
