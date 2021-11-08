import { info } from '../dist/main';

describe('info command', () => {
  it('basic', async () => {
    const { data } = await info();
    expect(data).toContain('# Server');
  });
});
