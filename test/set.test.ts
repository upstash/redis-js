import { set } from '../dist/main';
import { nanoid } from 'nanoid';

describe('set command', () => {
  it('save data', async () => {
    const key = nanoid();
    const value = nanoid();

    const { data } = await set(key, value);
    expect(data).toBe('OK');
  });
});
