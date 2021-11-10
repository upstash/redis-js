import { info } from '../../src';

describe('info command', () => {
  it('basic', async () => {
    const { data } = await info();
    expect(data).toContain('# Server');
  });
});
