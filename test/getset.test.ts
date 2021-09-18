import { get, getset, set } from '../src';

describe('getset command', () => {
  const key = 'mykey';
  const value1 = 'hi';
  const value2 = 'hey';

  it('basic', async () => {
    await set(key, value1);

    const { data: data1 } = await getset(key, value2);
    expect(data1).toEqual(value1);

    const { data: data2 } = await get(key);
    expect(data2).toEqual(value2);
  });
});
