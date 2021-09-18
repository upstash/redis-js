import { getrange, set } from '../src';
import { nanoid } from 'nanoid';

describe('get command', () => {
  const key = 'myKey';
  const value = 'This is a string';

  it('basic', async () => {
    await set(key, value);

    const { data } = await getrange(key, 0, 3);
    expect(data).toEqual('This');
  });
});
