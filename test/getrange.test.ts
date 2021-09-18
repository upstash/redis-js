import { getrange, set } from '../src';
import { nanoid } from 'nanoid';

describe('getrange command', () => {
  const key = 'mykey';
  const value = 'This is a string';

  it('basic', async () => {
    await set(key, value);

    const { data } = await getrange(key, 0, 3);
    expect(data).toEqual('This');
  });
});
