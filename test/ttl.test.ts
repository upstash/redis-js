import { set, ttl, expire } from '../src';
import { nanoid } from 'nanoid';
import sleep from '../utils/sleep';

describe('ttl command', () => {
  it('remaining time', async () => {
    const key = nanoid();
    await set(key, 'Hello');

    const { data: expireData } = await expire(key, 2);
    expect(expireData).toBe(1);

    const { data: ttlData } = await ttl(key);
    expect(ttlData).toBeGreaterThan(0);
  });

  it('key does not exist', async () => {
    const key = nanoid();
    await set(key, 'Hello');

    const { data: expireData } = await expire(key, 1);
    expect(expireData).toBe(1);

    await sleep();

    const { data: ttlData } = await ttl(key);
    expect(ttlData).toBe(-2);
  });

  it('key exists but has no associated expire', async () => {
    const key = nanoid();
    await set(key, 'Hello');

    const { data: ttlData } = await ttl(key);
    expect(ttlData).toBe(-1);
  });
});
