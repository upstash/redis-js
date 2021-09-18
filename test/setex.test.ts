import { ttl, setex } from '../src';
import { nanoid } from 'nanoid';

describe('psetex command', () => {
  it('remaining time', async () => {
    const key = nanoid();
    const value = nanoid();

    const { data } = await setex(key, 10, value);
    expect(data).toBe('OK');

    const { data: remainingTime } = await ttl(key);
    expect(remainingTime).toBeGreaterThan(0);
  });
});
