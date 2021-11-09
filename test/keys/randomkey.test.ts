import { randomkey, set } from '../../dist/main';
import { nanoid } from 'nanoid';

describe('randomkey command', () => {
  it('basic', async () => {
    await set(nanoid(), nanoid());

    const { data } = await randomkey();
    expect(data).not.toBeNull();
  });
});
