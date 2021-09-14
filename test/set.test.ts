import { set } from '../src';
import { nanoid } from 'nanoid';

describe('redis set command', () => {
  it('save', async () => {
    const key = 'key2/123';
    const value = nanoid();

    const { data } = await set(key, value);
    expect(data).toBe('OK');
  });
});
