import { ping } from '../src';
import { nanoid } from 'nanoid';

describe('echo command', () => {
  it('basic', async () => {
    const { data } = await ping();
    expect(data).toBe('PONG');
  });

  it('return value', async () => {
    const value = nanoid();

    const { data } = await ping(value);
    expect(data).toBe(value);
  });
});
