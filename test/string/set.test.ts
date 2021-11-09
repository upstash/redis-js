import { get, set } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('set command', () => {
  it('save data', async () => {
    const key = nanoid();

    const { data } = await set(key, 'value1');
    expect(data).toBe('OK');
  });

  it('save data with ex', async () => {
    const key = nanoid();

    const { data } = await set(key, 'value1', 'EX', 10);
    expect(data).toBe('OK');
  });
});
