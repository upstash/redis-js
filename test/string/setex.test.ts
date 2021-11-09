import { setex } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('setex command', () => {
  it('remaining time', async () => {
    const key = nanoid();
    const value = nanoid();

    const { data } = await setex(key, 10, value);
    expect(data).toBe('OK');
  });
});
