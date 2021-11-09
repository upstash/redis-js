import { set, renamenx, get } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('renamenx command', () => {
  it('basic', async () => {
    const key1 = nanoid();
    const value1 = 'Hello';

    const key2 = nanoid();
    const value2 = 'Hello';

    await set(key1, value1);
    await set(key2, value2);

    const { data } = await renamenx(key1, key2);
    expect(data).toBe(0);

    const { data: data1 } = await get(key2);
    expect(data1).toBe(value2);
  });
});
