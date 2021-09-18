import { pttl, psetex } from '../src';
import { nanoid } from 'nanoid';

describe('psetex command', () => {
  it('remaining time', async () => {
    const key = nanoid();
    const value = nanoid();

    const { data } = await psetex(key, 10000, value);
    expect(data).toBe('OK');

    const { data: remainingTime } = await pttl(key);
    expect(remainingTime).toBeGreaterThan(0);
  });
});
