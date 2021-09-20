import { randomkey } from '../src';

describe('randomkey command', () => {
  it('basic', async () => {
    const { data } = await randomkey();
    expect(data).not.toBeNull();
  });
});
